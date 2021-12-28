---
title: UUID Primary Keys for Eloquent
description: Changing implementation of primary keys from auto-incrementing integers to UUID
---
For a majority of use cases, an auto incrementing ID for your eloquent models should be fine. 
However, I have met a few cases where it has caused a living hell out of production data. 
Hopefully one or two of those cases will be shared in the [story](/story) section one of these days.


From that day on, I have been looking for better solutions to the auto-incrementing primary keys. Luckily we have one: UUID.
We leverage on Laravel's `Str::uuid()` for generation of the keys. However, that won't be the end of it. There are a few thing to keep in mind:
1. Auto-generation of the keys on record creation 
2. Database table structure
3. Order of our records when listing