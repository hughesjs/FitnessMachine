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

After reverse engineering the protocol, I discovered that the treadmill broadly conforms to the Bluetooth Low Energy Fitness Machine Profile Specification. As such, extending the capabilities of the application has become a lot easier. For instance pausing and resuming a workout, which is not possible with the EQiSports app, is actually supported by the hardware. 

# Proof of Concept

A very basic proof of concept exists [here](proof-of-concept). It is truly barebones and not good code, but it works and should be reasonably easy to understand.

This is a MAUI app and should be fairly straightforward to build.

1. Open the directory with the csproj file in
2. Run `dotnet build`
3. Install the app on your phone

I'm not including instructions on how to configure iOS or Android toolchains... Sorry but Google is your friend.

# New App - Fitness Machine

The [src](./src/) folder contains the new application. At the time of writing, this already surpasses the EQiSports app in terms of features and usability. It is written in Flutter and should run on Android and iOS (although I haven't tested it on Android yet).

When I have added a few more features, this will be published on the app store.

## Current Features

- Start/Stop Workout
- Pause/Resume Workout
- Speed Up/Slow Down

## Short Term Roadmap

- Add a workout history
- Write workouts to Apple Health
- Write workouts to Android Health
- Integrate sensor data into workouts
- Add workout planner
   - Time/Distance/Calorie Goals
   - Speed profiles
   - Heart rate targets and profiles

## Long Term Roadmap

- Add support for arbitrary devices conforming to the BLE Fitness Machine Profile Specification.
- Add a backend to store verified working devices
- Add non-fitness machine workouts (weights etc)
- Add a GenAI powered trainer



