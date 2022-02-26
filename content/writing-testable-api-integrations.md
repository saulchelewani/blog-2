---
title: Writing Good API Integrations - Rule of Thumb
description: How to make third-party API integrations testable and hot-swappable... it doesn't take much, but the benefits are countless
type: solution
author: Saul Chelewani
author_image: saul.jpg
image: saul.jpg
tags: laravel, API, testable, hot-swappable, refactoring, clean code
category: laravel
---
Software development is about building blocks, re-using code and taking advantage of solutions that were already made by 
other people in the fields. Don't re-invent the wheel. We can take advantage of existing solutions by cloning as is, 
using packages in our project, and integrating to existing published APIs. In this article we will dwell on the last one.  

API integrations will make our lives easier as we ride on top of out-of-the-box solutions but available for any sort of manipulation
before delivering to the end user. Having integrated to a handful APIs, I came up with a set of rules of thumbs when making 
API integrations. 

## Rule of Thumb
 1. Keep your connection variables separate
 2. Expect API calls to fail
 3. Have a mockable response interfaces
 4. Have hot-swappable request interfaces
 5. Log everything

We will use an example of a weather API by the [WeatherAPI.com](https://weatherapi.com) available on
[RapidAPI](https://rapidapi.com/hub), integrated into a Laravel application _If you are into
public API integrations, consider bookmarking RapidAPI._ You're welcome.

### 1. Keep your connection variables separate
This is the easiest to follow but often times ignored rule. Imagine you have written your integration and few weeks/months 
down the line the 3rd party sends you a notification that the IPs changed, so you have to switch to the new IP within the 
next 72 hours or your API will stop working. It's not a big deal but consider the inconvenience. If you follow CI/CD 
workflows, you'll need to go through the process just to change a single line of code. This is the piece of code we should
keep as app environment variables
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
In this implementation, during the API cut-over, we will just go on the server and edit the `.env` file. No commits, no PRs.
We are up and running in seconds.

### 2. Expect API calls to fail
When dealing external systems, things can go wrong at multiple points: loss of connectivity, timeouts, unprecedented downtimes
among many issues we can't have control over. As such, write your integration to expect failure and graceful fallbacks.
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

### 3. Have a mockable response interfaces
The spec of any "good" API you consume will provide you a standard structure of responses. That gives us an advantage to
predict how our service handler should manage the response data and format it correctly for our consumers. Another advantage
that gives us is to be able to "fake" the response if we are doing isolated tests or handling exceptions. 

We will use the same `WeatherService` class with more details, this time around.
```php[app/Services/Weather/WeatherService.php]
use Illuminate\Support\Facades\Http;
use Exception;
use App\Services\Weather\IWeatherResponse;
use App\Services\Weather\WeatherResponse;
use App\Services\Weather\FailuredWeatherResponse;

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
to plan, (the happy path), we return an object of `WeatherResponse` class; and if an exception is thrown we return an 
object of `FailuredWeatherResponse`. Both of these implement our response interface.
