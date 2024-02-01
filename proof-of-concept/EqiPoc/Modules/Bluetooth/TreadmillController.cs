using System.Buffers.Binary;
using EqiPoc.Modules.Workout;
using Plugin.BLE.Abstractions.Contracts;
using Plugin.BLE.Abstractions.EventArgs;

namespace EqiPoc.Modules.Bluetooth;

public class TreadmillController
{
    private readonly IAdapter _adapter;
    private readonly string _deviceName;
    
    private IDevice? _device;
    
    private const string ControlUuid = "2ad9";
    private ICharacteristic? _control;
    
    private const string StatusUuid = "2acd";
    private ICharacteristic? _status;
    
    private WorkoutStatus _workoutStatus;

    public event EventHandler? TreadmillReady;
    public event EventHandler<WorkoutStatus>? WorkoutStatusUpdated;
    
    public TreadmillController(IAdapter adapter, string deviceName)
    {
        _adapter = adapter;
        _deviceName = deviceName;
        _adapter.DeviceDiscovered += OnDeviceDiscovered;
    }

    private async void OnDeviceDiscovered(object? _, DeviceEventArgs deviceEvent)
    {
        if (deviceEvent.Device.Name != _deviceName) return;
        Console.WriteLine("Device found");
        
        await _adapter.StopScanningForDevicesAsync();
        
        _device = deviceEvent.Device;
        await _adapter.ConnectToDeviceAsync(_device);
        
        Console.WriteLine("Device connected");
        
        var services = await _device.GetServicesAsync();
        
        foreach (IService? service in services)
        { 
            var chars = await service.GetCharacteristicsAsync();
            
            ICharacteristic? control = chars.SingleOrDefault(c => c.Uuid == ControlUuid);
            if (control is not null)
            {
                _control = control;
            }
            
            ICharacteristic? status = chars.SingleOrDefault(c => c.Uuid == StatusUuid);
            if (status is not null)
            {
                _status = status;
            }

            if (status is not null && control is not null) break;
        }


        WakeTreadmill();
        
        _status!.ValueUpdated += StatusUpdated;

        await StartUpdates();

        TreadmillReady?.Invoke(this, EventArgs.Empty);
    }

    private void StatusUpdated(object? sender, CharacteristicUpdatedEventArgs e)
    {
        byte[] value = e.Characteristic.Value;
        WorkoutStatus status = new()
        {
            SpeedInKmh = BinaryPrimitives.ReadInt16LittleEndian(value.AsSpan()[2..4]) / 100m,
            DistanceInKm = BinaryPrimitives.ReadInt16LittleEndian(value.AsSpan()[4..6]) / 1000m,
            IndicatedCalories = BinaryPrimitives.ReadInt16BigEndian(value.AsSpan()[6..8]), // WHY BIG ENDIAN?!
            TimeInSeconds = BinaryPrimitives.ReadInt16LittleEndian(value.AsSpan()[12..14]),
            Steps = BinaryPrimitives.ReadInt16LittleEndian(value.AsSpan()[14..16])
        };
        _workoutStatus = status;
        WorkoutStatusUpdated?.Invoke(this, status);
    }

    public void WakeTreadmill()
    {
        byte[] payload = [0x00];
        Task.Run(async () => await _control.WriteAsync(payload)); 
    }

    public void StartTreadmill()
    {
        Task.Run(async () => await StartUpdates());
        byte[] payload = [0x07];
        Task.Run(async () => await _control.WriteAsync(payload));
    }

    public void StopTreadmill()
    {
        Task.Run(async () => await StopUpdates());
        byte[] payload = [0x08, 0x01];
        Task.Run(async () => await _control.WriteAsync(payload));
    }

    public void SetSpeed(decimal kmh)
    {
        kmh = Math.Clamp(kmh, 1, 6);
        byte[] payload = [0x02, 0x00, 0x00];
        var span = payload.AsSpan()[1..3];
        BinaryPrimitives.WriteInt16LittleEndian(span, (short)(kmh * 100));
        Task.Run(async () => await _control.WriteAsync(payload));
    }
    
    public void SpeedUpTreadmill()
    {
        SetSpeed(_workoutStatus.SpeedInKmh + 0.5m);
    }

    public void SlowDownTreadmill()
    {
        SetSpeed(_workoutStatus.SpeedInKmh - 0.5m);
    }
    
    public void StartConnectingToDevice()
    {
        Task.Run(() => _adapter.StartScanningForDevicesAsync());
    }

    private async Task StartUpdates()
    {
        await _status.StartUpdatesAsync();
    }
    
    private async Task StopUpdates()
    {
        await _status.StopUpdatesAsync();
    }
}