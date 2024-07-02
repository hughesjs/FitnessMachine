# Protocol Definitions

## Contributing

I only have one CITYSPORTS treadmill, so I can only reverse engineer the protocol for that one. If you have a different CITYSPORTS treadmill, please raise an issue and I'll see if I can add support for it.

If you're confident reversing the protocol yourself, please follow the packet capture instructions and provide a similar description [to this one](protocol/CS-WP8/README.md).

If you're not confident reversing it yourself, please still submit the packet capture and I'll see what I can do.

## Taking a Packet Capture

A packet capture is a log of all the bluetooth traffic between your phone and the treadmill. This is how we reverse engineer the protocol.

### Enable Packet Capturing 

To enable packet capturing on your iPhone, follow [these instructions](https://www.bluetooth.com/blog/a-new-way-to-debug-iosbluetooth-applications/) or just run the iOS app on your Mac and skip all the profile stuff.

To enable packet capturing on your Android, follow [these instructions](https://medium.com/propeller-health-tech-blog/bluetooth-le-packet-capture-on-android-a2109439b2a1).

### Performing the capture

You need to follow these steps exactly or the capture won't be useful.

#### Capture 1 (Not on the treadmill)

1. Start capturing packets
2. Open the EQiSports app
3. Connect to the treadmill
4. Start a workout
5. Increase the speed by increments with a few seconds in between each increment to full speed
6. Stop the workout
7. Stop capturing packets
8. Save the capture

#### Capture 2 (On the treadmill)

1. Start capturing packets
2. Get on the treadmill
3. Open the EQiSports app
4. Connect to the treadmill
5. Start a workout
6. Increase the speed by increments with a few seconds in between each increment to 3kmh
7. Walk on it for about a minute
8. Stop the workout
9. Stop capturing packets
10. Save the capture
11. Note down the steps, duration, distance, and calories indicated by your treadmill

### Submitting the capture

1. Create a folder under `protocol` with the model of your treadmill
2. Put your captures in there with a readme file of your notes
3. Submit a pull request