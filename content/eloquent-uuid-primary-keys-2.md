---
title: Behind the Blog
description: Changing the implementation of Laravel Eloquent primary keys from auto-incrementing integers to UUID string
type: story
author: Saul Chelewani
author_image: saul.jpg
image: saul.jpg
---

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
