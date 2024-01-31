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
    
    private async Task DoHandshake()
    {
        if (_device == null) return;
        
        string[] characteristicUuids = ["2acd", "2ad3", "2ad9", "2ada", "c4208999-8d92-bee1-4456-2068528eccf6"];
        byte[][] values = [[0x01, 0x00], [0x01, 0x00], [0x02, 0x00], [0x01, 0x00], [0x01, 0x00]];
        
        for (int i = 0; i < characteristicUuids.Length; i++)
        {
            ICharacteristic? characteristic = _characteristics[characteristicUuids[i]];
            
            byte[] payload = values[i];
            IDescriptor? descriptor = (await characteristic.GetDescriptorsAsync()).Single();
            
            await descriptor.WriteAsync(payload);
        }
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

    // public async Task HitEveryCharacteristicAndDescriptor()
    // {
    //     byte frame = 0;
    //     foreach (ICharacteristic characteristic in _characteristics.Values)
    //     {
    //         CancellationTokenSource cts = new();
    //         cts.CancelAfter(1000);
    //         bool errored = false;
    //         try
    //         {
    //             await characteristic.WriteAsync([frame++], cts.Token);
    //         }
    //         catch
    //         {
    //             errored = true;
    //         }
    //         Console.WriteLine($"Writing {frame} to {characteristic.Uuid} [{(errored ? "FAILED" : "OK")}]");
    //     }
    //     
    //     foreach (IDescriptor? descriptor in _descriptors)
    //     {
    //         bool err = false;
    //         CancellationTokenSource cts = new();
    //         cts.CancelAfter(1000);
    //         try
    //         {
    //             await descriptor.WriteAsync([frame++], cts.Token);
    //         }
    //         catch
    //         {
    //             err = true;
    //         }
    //         Console.WriteLine($"Writing {frame} to {descriptor.Characteristic}->{descriptor.Id} [{(err ? "FAILED" : "OK")}]");
    //     }
    // }

    public void StartConnectingToDevice()
    {
        Task.Run(() => _adapter.StartScanningForDevicesAsync());
    }
}