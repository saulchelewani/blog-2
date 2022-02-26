---
title: Writing Good API Integrations - Rule of Thumb
description: How to make third-party API integrations testable and hot-swappable... it doesn't take much, but the benefits are countless
type: solution
author: Saul Chelewani
author_image: saul.jpg
image: saul.jpg
tags: laravel, API, testable, hot-swappable, refactoring, clean code, integration
category: laravel
---
Software development is about building blocks, re-using code and taking advantage of solutions that were already made by 
other people in the field. Don't re-invent the wheel. We can take advantage of existing solutions by cloning as is, 
using packages in our project, and integrating to existing published APIs. In this article we will dwell on the last one.  

API integrations will make our lives easier as we ride on top of out-of-the-box solutions. Having integrated to a 
handful APIs, I came up with a set of guidelines we can use when making 
API integrations. 

## Rule of Thumb
 1. Keep your connection variables separate
 2. Expect API calls to fail
 3. Have a mockable response interfaces
 4. Have hot-swappable request interfaces
 5. Log everything

We will use an example of a weather API by [WeatherAPI.com](https://weatherapi.com) available on
[RapidAPI](https://rapidapi.com/hub), integrated into a Laravel application. _If you are into
public API integrations, consider bookmarking RapidAPI._ You're welcome.

### 1. Keep your Connection Variables Separate
This is the easiest to follow but often times ignored rule. Imagine you have written your integration and few weeks/months 
down the line the 3rd party sends you a notification that the IPs changed, so you have to switch to the new IP within the 
next 72 hours or your API will stop working. It's not a big deal but consider the inconvenience. If you use CI/CD 
workflows, you'll need to go through the process just to change a single line of code. 
This is the piece of code we should keep as app environment variables
```php[app/Services/Weather/WeatherService.php]
use Illuminate\Support\Facades\Http;

$response = Http::timeout(10)
    ->get(sprintf('%s/%s?q=%s&days=%s', 
        config('weather.host'), 
        config('weather.endpoint'),
        $location,
        $days
    );
 ```
```php[config/weather.php]
return [
    'host' => env('WEATHER_HOST'),
    'endpoint' => env('WEATHER_ENDPOINT'),
];      
```
```dotenv[.env]
WEATHER_HOST=https://weatherapi-com.p.rapidapi.com
WEATHER_ENDPOINT=forecast.json
```
The three code snippets above are our service class, a config file and an env file. In this implementation, during the API cut-over, we will just go on the server and edit the `.env` file. No commits, no PRs.
We are up and running in seconds.

### 2. Expect API Calls to Fail
When dealing external systems, things can go wrong at multiple points: loss of connectivity, timeouts, unprecedented downtimes,
among many issues we can't have control over. As such, we should write our integration to expect failure and graceful fallbacks.
```php[app/Services/Weather/WeatherService.php] 
use Illuminate\Support\Facades\Http;
use Exception;

try {
    $response = Http::timeout(10)
        ->get(sprintf('%s/%s?q=%s&days=%s', 
            config('weather.host'), 
            config('weather.endpoint'),
            $location,
            $days
        );
catch(Exception $exception) {
    // handle the failure gracefully
}       
```
Using try-catch block takes care of the unprecedented 3rd party API failures. Then we should think of handing it 
gracefully. That brings us to our next rule...

### 3. Have a Mockable Response Interfaces
The spec of any "good" API we consume will provide a standard structure of responses. That gives us an advantage to
predict how our service handler should manage the response data and format it correctly for our consumers. Another advantage
that gives us is the ability to "fake" the response if we are doing isolated tests and handling exceptions. 

We will use the same `WeatherService` class with more details this time around.
```php[app/Services/Weather/WeatherService.php]
namespace App\Services\Weather;

use Illuminate\Support\Facades\Http;
use Exception;

public function query(string $location, int $days): IWeatherResponse
{
    try {
        $response = Http::timeout(10)
            ->get(sprintf('%s/%s?q=%s&days=%s', 
                config('weather.host'), 
                config('weather.endpoint'),
                $location,
                $days
            );
        return new WeatherResponse($response);    
    catch(Exception $exception) {
        return new FailuredWeatherResponse($exception->getMessage());
    }    
}
```
The query method in the snippet above takes location and number of days we are getting the weather forecast for. In turn,
it is expected to return a response object of the `IWeatherResponse` interface. In the try block, if everything goes as 
expected, (the happy path), we return an object of `WeatherResponse` class. If an exception is thrown we return an 
object of `FailuredWeatherResponse`. Both of these implement our response interface.

### 4. Have Hot-swappable Request Interfaces
Just as we have a response interface, we will have a similar implementation for a request interface. This time for slightly
different reasons. The main reason we need a request interface is the ability to swap it out for a fake or a 
different API altogether. Consider a scenario where the 3rd party API charges you per request, and you are not ready to
start incurring those costs while you're still developing your implementation. Sometimes you just want to work offline.
A suitable approach is to swap the API with a fake implementation which returns the same response structure.

```php[app/Services/Weather/WeatherService.php]
namespace App\Services\Weather;

use Illuminate\Support\Facades\Http;
use Exception;

class WeatherService implements IWeatherService
{
    public function query(string $location, int $days): IWeatherResponse
    {
        try {
            $response = Http::timeout(10)
                ->get(sprintf('%s/%s?q=%s&days=%s', 
                    config('weather.host'), 
                    config('weather.endpoint'),
                    $location,
                    $days
                );
            return new WeatherResponse($response);    
        catch(Exception $exception) {
            return new FailuredWeatherResponse($exception->getMessage());
        }    
    }
}  
```
Now that we have our request class in place, we need a way to make this swappable on the fly. We will delegate the calls 
to this interface by what I like to call a `client` class.
```php[app/Services/Weather/WeatherClient.php]
namespace App\Services\Weather;

class WeatherClient 
{
    private readonly IWeatherService $service;
    
    public function __construct(private string $location, private int $days)
    {
        $this->service = app(IWeatherService::class);
    }
    
    public function query(): IWeatherResponse
    {
        return $this->service->query($this->location, $this->days);
    }
}
```
Next, when we want to invoke our API integration we simply call our client and the rest is handled by the delegation.
```php
$response = (new WeatherClient('Blantyre', 3))->query();
```
Next, we use the `app service provider` to bind the interface to our implementation
```php[app/Providers/AppServiceProvider.php]
public function register()
{
    $this->app->bind(IWeatherService::class, WeatherService::class)
}
```
And how the hot-swapping comes in, we just replace that line with the one in the snippet below
```php
$this->app->bind(IWeatherService::class, FakeWeatherService::class)
```
```php[app/Services/Weather/FakeWeatherService.php]
namespace App\Services\Weather;

class FakeWeatherService implements IWeatherService
{
    public function query(string $location, int $days): IWeatherResponse
    {
        return new FakeWeatherResponse();
    }    
}
```
### 5. Log Everything
That is as easy as it sounds. We may use events and pass them the data 
we will need in the logs and let event listeners handle the rest. That gives us flexibility and also remove the 
clutter of side effects from our business logic.

This is how our service class would look with event dispatchers added.
```php
public function query(string $location, int $days): IWeatherResponse
{
    Event::dispatch(new WeatherRequestEvent($location, $days));
    try {
        $response = Http::timeout(10)
            ->get(sprintf('%s/%s?q=%s&days=%s', 
                config('weather.host'), 
                config('weather.endpoint'),
                $location,
                $days
            );
        Event::dispatch(new WeatherResponseEvent($response)));    
        return new WeatherResponse($response);    
    catch(Exception $exception) {
        Event::dispatch(new WeatherExceptionEvent($exception));
        return new FailuredWeatherResponse($exception->getMessage());
    }    
}
```
## Conclusion
There is no hard stance on what to do and what not to do when implementing an API integration. However, drafting a few
guidelines on what we could call best practice highly improves on manageability, testability and readability of
our code base. Secondly, as we add more integrations to our portfolio, we will soon find out that everything comes 
natural. We don't have to think of what to do and how to do it. 

The 5 guidelines outlined above are very opinionated, but you will soon appreciate how speed of delivery and
code quality improves. Just remember: Keep your connection variables separate. Expect API calls to fail. 
Have a mockable response interfaces. Have hot-swappable request interfaces. Log everything.

Happy Coding!


