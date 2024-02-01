# Introduction

CITYSPORTS treadmills rely on the EQiSports app, which is objectively terrible.

Here are some reasons why:

- Can't pause and resume workouts
- Doesn't record workout history
- Won't push data to Apple Health
- Basically just a tech demo of the integration

This project aims to reverse engineer the bluetooth protocol used by these treadmills and then to create a better app that addresses these concerns.

# Protocol

The details of the protocol are [here](protocol).

And there's a proof of concept [here](proof-of-concept).

# Proof of Concept

A very basic proof of concept exists [here](proof-of-concept).

This is a MAUI app and should be fairly straightforward to build.

1. Open the directory with the csproj file in
2. Run `dotnet build`
3. Install the app on your phone

I'm not including instructions on how to configure iOS or Android toolchains... Sorry but Google is your friend.

# New App

This section will be updated once it has been developed.
