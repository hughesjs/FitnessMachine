using System.Buffers.Binary;
using Plugin.BLE.Abstractions.Contracts;
using Plugin.BLE.Abstractions.EventArgs;

namespace EqiPoc.Modules.Bluetooth;

public class TreadmillController
{
    private readonly IAdapter _adapter;
    private readonly string _deviceName;
    
    private IDevice? _device;
   
    private Dictionary<string, ICharacteristic> _characteristics;

    public event EventHandler? TreadmillReady;
    
    public TreadmillController(IAdapter adapter, string deviceName)
    {
        _adapter = adapter;
        _deviceName = deviceName;
        _characteristics = [];
        
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
            foreach (ICharacteristic? characteristic in chars)
            {
                _characteristics.Add(characteristic.Uuid, characteristic);
            }
        }
        Console.WriteLine($"Found {_characteristics.Keys.Count} characteristics");

        WakeTreadmill();
        
        //await DoHandshake();

        TreadmillReady?.Invoke(this, EventArgs.Empty);
    }

    public void WakeTreadmill()
    {
        byte[] payload = [0x00];
        ICharacteristic characteristic = _characteristics["2ad9"];
        Task.Run(async () => await characteristic.WriteAsync(payload)); 
    }

    public void StartTreadmill()
    {
        byte[] payload = [0x07];
        ICharacteristic characteristic = _characteristics["2ad9"];
        Task.Run(async () => await characteristic.WriteAsync(payload));
    }

    public void StopTreadmill()
    {
        byte[] payload = [0x08, 0x01];
        ICharacteristic characteristic = _characteristics["2ad9"];
        Task.Run(async () => await characteristic.WriteAsync(payload));
    }

    public void DoDemo()
    {
        Task.Run(async () =>
        {
            StartTreadmill();
            await Task.Delay(5000);
            for (short i = 2; i <= 6; ++i)
            {
                Console.WriteLine("Increasing Speed");
                SetSpeed(i);
                await Task.Delay(5000);
            }
            for (short i = 5; i >= 1; --i)
            {
                Console.WriteLine("Decreasing Speed");
                SetSpeed(i);
                await Task.Delay(5000);
            }
            StopTreadmill();
        });
    }

    public void SetSpeed(short kmh)
    {
        byte[] payload = [0x02, 0x00, 0x00];
        var span = payload.AsSpan()[1..3];
        BinaryPrimitives.WriteInt16LittleEndian(span, (short)(kmh * 100));
        ICharacteristic characteristic = _characteristics["2ad9"];
        Task.Run(async () => await characteristic.WriteAsync(payload));
    }
    
    public void StartConnectingToDevice()
    {
        Task.Run(() => _adapter.StartScanningForDevicesAsync());
    }
}