---
title: How we test in isolation - Mock any class
description: Write effective laravel unit and feature tests by mocking out any part of the application you want to manipulate
type: story
author: Saul Chelewani
author_image: saul.jpg
image: saul.jpg
tags: laravel, unittest, testing, mock, mockery, IoC, resolve out of container
category: laravel
---
"Fake it until you make it" so they say. Well, this side of TDD we say "Fake it if you can't make it"

I have this interesting story about some integration I recently worked on with [Caspater](https://github.com/caspater).
It is not interesting because it is a laughing matter or anything, (sorry to disappoint you). It is
interesting because despite all I thought I knew about feature tests, there is always one more thing to learn.

Let's say we have an integration task. The API we are trying to call requires us to send `email` and `unique request ID`
among other params; and in turn, the API responds with their own unique response ID, spits back our request ID and other
details about the transaction in an xml format. Yes, I forgot to say we are calling a SOAP API.
As part of our logging process, we use the returned `request ID` and pass it 
to our `event dispatcher` to handle the procedure. The logging end may not be our problem, but some architectural decisions
we have made along the way will require us to think outside the box on how this can be tested. 

Having noticed that all integrations are taking `email` and `unique request ID`, we create a `RequestPayload` class
that prepends the two to every payload passed to our service class. Now that routine is out of our way forever. Inside
this `payload` class, we also delegate the logic for generating the transaction ID to its own utility class.

```php
namespace App\Services\Subscription;

class SubscriptionService
{
    public function __construct(private SubscriptionPayload $payload){}
    
    public function subscribe(): ISubscriptionResponse
    {
        try {
            $response = Http::post(config('service.url'), $payload->toArray());
                
            \Event::dispatch(new SubscriptionEvent($response));
            
            return new SubscriptionResponse($response);
        } catch(\Exception $exception) {
            return new FailedIntegrationResponse($exception->getMessage());
        }       
    }
}
```

```php
namespace App\Services\Subscription;

class SubscriptionPayload extends RequestPayload
{
    public function __construct(string $email, private string $packageId)
    {
        parent::__construct($email);
    }
    
    public function toArray(): array
    {
        return [...parent::toArray(), 'package_id' => $this->packageId];
    }    
}
```
Right now we have our service class and a factory class that generates subscription request payload to go with it.
To test this implementation will be equally simple. We `new` up the service, call the `subscribe` method and assert
the contents of the resulting `ISubscriptionResponse` object. That's where our problems begin.

To test an integration, we'll need to either `fake` or `mock` "things". On this one, we will mock the Http request and 
give it a fake response body from a file we have in our test directory.

```php
namespace Tests\Unit;

use Tests\TestCase;

class SubscriptionTest extends TestCase
{
    public function test_logs_response_after_successful_subscription()
    {
        \Http::fake(['*' => Http::response(file_get_contents(__DIR__ . '/fake_response.xml'))]);
        
        $service = new SubscriptionService(new SubscriptionPayload('lorem@example.io', 'ABC123'));
        $response = $service->subscribe();
        
        $this->assertDatabaseHas('subscription_footprints', [
            'request_id' => '1234UNIQUE',
            'email' => 'lorem@example.io',
            'package' => 'ABC123'
        ])
    }
}
```
I am no prophet but this test will fail. Remember we stated earlier that the request ID is generated inside 
`RequestPayload` class. At this moment we have no access whatsoever to manipulate it. We have control over the fake
response file, but not what our code generates to send to our mocked integration. Let's fix that.

We will take advantage of the IoC and have our request ID factory class resolve out of the container. That way we can
mock it with anything we have control over.

```php
namespace App\Services\Subscription;

abstract class RequestPayload
{
    public function __construct(private string $email){}
    
    public function toArray(): array
    {
        return [
            'email' => $this->email,
            'request_id' => (resolve(RequestIDFactory::class))->make(),
        ];
    } 
} 
```
We avoid newing up the `RequestIDFactory` object in the class above because doing that will assign a concrete 
implementation to our call. Instead, we will use `resolve` helper function to have it resolved on runtime. That's
when we go back to our test and exercise this control we have earned ourselves.
```php
namespace Tests\Unit;

use Tests\TestCase;
use App\Services\Subscription\RequestIDFactory;

class SubscriptionTest extends TestCase
{
    public function test_logs_response_after_successful_subscription()
    {
        \Http::fake(['*' => Http::response(file_get_contents(__DIR__ . '/fake_response.xml'))]);
        
        $this->app->bind(RequestIDFactory::class, function() {
            $mock = \Mockery::mock(RequestIDFactory::class);
            $mock->shouldReceive('make')->andReturn('1234UNIQUE');
            return $mock;
        });
        
        $service = new SubscriptionService(new SubscriptionPayload('lorem@example.io', 'ABC123'));
        $response = $service->subscribe();
        
        $this->assertDatabaseHas('subscription_footprints', [
            'request_id' => '1234UNIQUE',
            'email' => 'lorem@example.io',
            'package' => 'ABC123'
        ])
    }
}
```
You might have noticed that `RequestIDFactory` is not an interface but we are able to manipulate the runtime and swap
it with a mock implementation and dictate what it spits out. At this moment we do not care about its internal implementation
because that's not the scope of our test. Our goal is to make a request and make sure it logs the outcome. The only way
we can successfully test that, is by controlling what our code does at a certain point and being able to check if those
exact values are logged elsewhere.

Having spent a good part of our day banging heads on how to test that specific detail, I can challenge you that anything
written in isolation can be tested in isolation. You just have to fake your way in.

Happy coding!

