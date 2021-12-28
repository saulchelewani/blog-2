---
title: UUID Primary Key for Eloquent Models
description: Changing the implementation of Laravel Eloquent primary keys from auto-incrementing integers to UUID string
type: solution
author: Saul Chelewani
author_image: saul.jpg
---
For the majority of use cases, an auto incrementing ID for your eloquent models should be fine. 
However, I have met a few cases where it has caused a living hell out of production data. 
Hopefully one or two of those cases will be shared in the [story](/story) section one of these days.

I have been looking for better solutions to the auto-incrementing primary keys. Luckily we have one: `UUID`.
We leverage on Laravel's `Str::uuid()` for generation of the keys. However, that won't be the end of it. There are a few thing to keep in mind:
1. Auto-generation of the keys on record creation 
2. Database table structure
3. Order of our records when listing

## Changes required
We will make three changes to our files and then look at ways of auto-generating the required boilerplate code going forward.
### 1. Migration
Instead of using 
```php[migrations/create_users_table.php]
$table->id()
```
Use
```php[migrations/create_users_table.php]
$table->uuid('id')->primary();
```

### 2. Model
Add the following code in the boot method to generate the `UUID` on creation of your model
```php[app/Models/User.php]
use Exception;
use Illuminate\Support\Str;

protected static function boot()
{
    parent::boot();

    static::creating(function ($model) {
        try {
            $model->id = (string)Str::uuid(); 
        } catch (Exception $e) {
            abort(500, $e->getMessage());
        }
    });
}
```

Next, we need to tell `Eloquent` to expect `UUID` type of key and not to auto-increment it. In the same model, we add the following properties:
```php[app/Models/User.php]
protected $keyType = 'uuid';
public $incrementing = false;
```

### 3. Foreign Keys
This could easily fall under `Migration` but I didn't want it to be buried between the lines.

Instead of using
```php[migrations/create_users_table.php]
$table->foreignId('user_id')->constrained();
```
Use 
```php[migrations/create_users_table.php]
$table->foreignUuid('user_id')->constrained();
```
## Refactoring 
This implementation works fine but you might have noticed that we are doing it per model. Thus, every model we create, we will have to routinely make all those changes. I hate routines! Needless to say, that's a perfect candidate for refactoring.

### 1. UUID Trait
Firstly, let's move the boot method to a trait and see how we can leverage on other powers of Laravel to completely forget about that piece of code

```php[app/Traits/Uuid.php]
namespace App\Traits;

use Exception;
use Illuminate\Support\Str;

trait Uuid
{
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            try {
                $model->id = (string)Str::uuid(); 
            } catch (Exception $e) {
                abort(500, $e->getMessage());
            }
        });
    }
}
```

Then our models become leaner...
```php[app/Models/User.php]
namespace App\Models;

use App\Traits\Uuid;
// other imports...

class User extends Model
{
    use HasFactory, Notifiable, HasApiTokens, Uuid;

    protected $keyType = 'uuid';
    public $incrementing = false;
}
```
### 2. Laravel Stubs
We can still move more of the `routine` away from us by pushing the boilerplate code to laravel stubs. First we publish the stubs that are used to generate our migrations and models
```terminal
php artisan stubs:publish
```
The stubs are published in the `/stubs` directory. Now we can edit the `model.stub` and `migration.create.stub` files to include the changes we changes we would otherwise make each time we generate new model and migration.

Your final stubs should look like the following

```php[stubs/model.stub]
namespace {{ namespace }};

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class {{ class }} extends Model
{
    use HasFactory, Uuid;

    protected $keyType = 'uuid';
    public $incrementing = false;
    protected $guarded = [];
}
```

```php[stubs/migration.create.stub]

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class {{ class }} extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('{{ table }}', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('{{ table }}');
    }
}
```


## Summary
We have managed to change the primary key from auto-incrementing integer to a string UUID. More importantly, we have automated the generation of the boilerplate code so that we don't have to think about how we generate UUID for the next model we generate; and my favourite... no routines!

Having used UUID, we lose the advantage of using the primary key for sorting/ordering our records. You may consider using `created_at`. Basically it will serve the same purpose.

Happy coding!
