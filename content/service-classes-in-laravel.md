---
title: Service Classes in Laravel
description: Service classes, what they are, and how to use them to organize your code in a laravel application
type: solution
author: Saul Chelewani
author_image: saul.jpg
image: saul.jpg
tags: laravel, service classes, services, refactoring, clean code
category: laravel
---
Service classes are optional in a Laravel application; and sure you don't have to use them if you don't need to.
However, looking at the use cases we always have as developers, chances are, you more often than not need them.

## What is a Service Class

A service class is an encapsulated piece of code that solves one problem. This definition however is kind of vague and
can soon get us in trouble. Here is how: A whole module can fit in that criteria. A whole app too! Maybe not. A service 
class will have one functionality, one public method and its output is always predictable. To help us break it down, we 
will have a few examples along the way.

## When to use a Service Class

Let's look at a piece of code that creates a user, for example. You could have the following on your checklist:
* Fetch a user role from the database
* Create a random password
* Create a user with the given role and password
* Notify the user
* Update user stats
* Write logs

This is our standard operating procedure. Now let's code it away
```php
namespace App\Http\Controllers;

use App\Enums\ActivityType;
use App\Enums\UserCreationMode;
use App\Factories\PasswordFactory;
use App\Http\Requests\UserCreationRequest;
use App\Models\Role;
use App\Models\UserActivity;
use App\Models\UserRegistration;
use App\Notifications\UserAccountCreatedNotification;
use Illuminate\Http\JsonResponse;

class UsersController extends Controller;
{
    public function store(UserCreationRequest $request): JsonResponse
    {
        $role = Role::find($request->get('role_id'));
        
        $password = (new PasswordFactory())->make();
        
        $user = $role->users()->create([
            ...$request->validated(),
            'password' => $password->getHash(),
        ]);
        
        $user->notify(new UserAccountCreatedNotification($password));
        
        UserRegistration::create([
            'email' => $request->get('email'),
            'mode' => UserCreationMode::portal,
            'date' => today(),
        ]);
        
        UserActivity::create([
            'user_id' => $user->getKey(),
            'activity' => ActivityType::user_creation,
        ]);
        
        return $this->respond()->ok()->json();
    }
}
```
The above code is logically correct. Your application will run without any issues, and to some standards, it is 
beautiful code. There are a few issues with this piece of code that will bite us soon. 

Firstly, Our `store` method is doing too much. One would argue that, "_but that's our SOP. Everything we do there is necessary_". 
Yes, it is; but maybe it doesn't belong there. When you have a method that has multiple chunks of code doing different 
tasks of the SOP, know it is time to refactor that code into private methods. That brings us to our next problem. We are 
working with `Controller` code, and having private methods in a controller is a no-no. Don't do it.

Secondly, this is a user creating their own account. So we will have another use case: Admin should be able to create
a user from the admin panel... and another one, admin should be able to create multiple users using an Excel or CSV file.
Both of these scenarios will need almost the same code, just with a few modifications, different routes, different
controllers. We will end up repeating code. Yes, you guessed it. Don't do it. Your code must stay DRY. Don't Repeat 
Yourself.

This is the perfect time to introduce a service class. Our user creation procedure will be handled by one class. If the 
SOP changes, we will only have one place to change and all APIs that deal with user creation will just delegate to it.

Let's get the IDE again and make a "few" changes.
```php
namespace App\Services;

use App\Models\Role;
use App\Enums\UserCreationMode;
use App\Models\User;
use App\Utils\Password;

class UserCreationService
{
    private Role $role;
    private array $attributes;
    private UserCreationMode $mode;
    private User $user;
    private Password $password;
    
    public function __construct(Role $role, array $attributes, UserCreationMode $mode)
    {
        $this->role = $role;
        $this->attributes = $attributes;
        $this->mode = $mode;
        $this->password = (new PasswordFactory())->make();
    }
    
    public function query(): User
    {
        $this->createUser()->sendNotification()->updateStats()->writeLog();
        return $this->user;
    }
    
    private function createUser(): self
    {
        $this->user = $this->role->users()->create([
            ...$this->attributes,
            'password' => $this->password->getHash(),
        ]);
        return $this;
    }
    
    private function sendNotification(): self
    {
        $this->user->notify(new UserAccountCreatedNotification($this->password));
        return $this;
    }
    
    private function updateStats(): self 
    {
        UserRegistration::create([
            'email' => $this->attributes['email'],
            'mode' => $this->mode,
            'date' => today(),
        ]);
        return $this;
    }
    
    private function writeLog(): self
    { 
        UserActivity::create([
            'user_id' => $this->user->getKey(),
            'activity' => ActivityType::user_creation,
        ]);
        return $this;
    }
}
```
Now that we have our service class, let's go through it and see how simple we made life for ourselves. The constructor
is expecting us to pass the role we will assign the created user to, the attributes of the user in an array, I don't like 
working with arrays as arguments but that's for another day... and our last argument is the user creation mode, which is
taking an enum of the preset modes we will have. One more thing that is happening in the constructor is the generation
of a password delegated to some `PasswordFactory` somewhere.

The only public method we have in this class is `query`. This is where we do all our SOP and return the only result of 
the service, the `user`
```php
$this->createUser()->sendNotification()->updateStats()->writeLog();
return $this->user;
```
We had to make the `query` method so self-explanatory that saying anything more about the service is redundant. We move.

## Using the Service Class
In our case, we have three scenarios.
1. Creating own user account from the portal
2. Admin creating a user from the admin panel
3. Admin mass-creating users using an Excel or CSV file

```php[app/Http/Controllers/UserCreation/SelfUserCreationController.php]
namespace App\Http\Controllers\UserCreation;

use App\Enums\UserCreationMode;
use App\Http\Controllers\Controller;
use App\Http\Requests\SelfUserCreationRequest;
use App\Services\UserCreationService;
use Illuminate\Http\JsonResponse;

class SelfUserCreationController extends Controller
{
    public function __invoke(SelfUserCreationRequest $request): JsonResponse
    {
        $role = Role::find($request->get('role_id'));
        (new UserCreationService($role, $request->only('name', 'email'), UserCreationMode::portal))->query();
        
        return $this->respond()->ok()->json();
    }
}
```

```php[app/Http/Controllers/UserCreation/AdminUserCreationController.php]

namespace App\Http\Controllers\UserCreation;

use App\Enums\UserCreationMode;
use App\Http\Controllers\Controller;
use App\Http\Requests\AdminUserCreationRequest;
use App\Services\UserCreationService;
use Illuminate\Http\JsonResponse;

class AdminUserCreationController extends Controller
{
    public function __invoke(AdminUserCreationRequest $request): JsonResponse
    {
        $role = Role::find($request->get('role_id'));
        (new UserCreationService($role, $request->only('name', 'email'), UserCreationMode::admin))->query();
        
        return $this->respond()->ok()->json();
    }
}
```

```php[app/Http/Controllers/UserCreation/BatchUserCreationController.php]

namespace App\Http\Controllers\UserCreation;

use App\Enums\UserCreationMode;
use App\Http\Controllers\Controller;
use App\Http\Requests\BatchUserCreationRequest;
use App\Services\UserCreationService;
use Illuminate\Http\JsonResponse;

class BatchUserCreationController extends Controller
{
    public function __invoke(BatchUserCreationRequest $request): JsonResponse
    {
        $role = Role::find($request->get('role_id'));
        
        $request->getUsers()
            ->each(fn(array $attrs) => (new UserCreationService($role, $attrs, UserCreationMode::batch))->query());
        
        return $this->respond()->ok()->json();
    }
}
```
You might have noticed that the third controller `BatchUserCreationController` has some magic going on. We have some 
method `getUsers()` in `BatchUserCreationRequest` that returns a collection of user rows extracted from the input file.
That's another lever of encapsulation you can do to streamline the business logic happening in your controller. 

Then we have another piece of magic in our controllers
```php
return $this->respond()->ok()->json();
```
This is from a [response builder](https://packagist.org/packages/bluecloud/response-builder) package 
[Yamikani Kalinde ](https://github.com/ykalinde) and I developed. Feel free to
check it out.

Happy Coding!


