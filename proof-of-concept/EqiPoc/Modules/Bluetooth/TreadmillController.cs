using Plugin.BLE.Abstractions.Contracts;
using Plugin.BLE.Abstractions.EventArgs;

namespace EqiPoc.Modules.Bluetooth;

public class TreadmillController
{
    private readonly IAdapter _adapter;
    private readonly string _deviceName;
    
    private IDevice? _device;
    private ICharacteristic? _control;
    private ICharacteristic? _status;
    
    private List<ICharacteristic> _characteristics;

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

        List<ICharacteristic> characteristics = [];
        foreach (IService? service in services)
        {
            var chars = await service.GetCharacteristicsAsync();
            characteristics.AddRange(chars);
        }

        _characteristics = characteristics;
        
        Console.WriteLine($"Found {characteristics.Count} characteristics");
        
        _control = characteristics.FirstOrDefault(c => c.Uuid == "2ad9");
        _status = characteristics.FirstOrDefault(c => c.Uuid == "2acd");
        
        Console.WriteLine($"Control: {_control?.Uuid}");
        Console.WriteLine($"Status: {_status?.Uuid}");

        TreadmillReady?.Invoke(this, EventArgs.Empty);
    }

    public async Task HitEveryCharacteristic()
    {
        byte frame = 0;
        foreach (ICharacteristic characteristic in _characteristics)
        {
            CancellationTokenSource cts = new();
            cts.CancelAfter(1000);
            bool errored = false;
            try
            {
                await characteristic.WriteAsync([frame++], cts.Token);
            }
            catch
            {
                errored = true;
            }
            Console.WriteLine($"Writing {frame} to {characteristic.Uuid} [{(errored ? "FAILED" : "OK")}]");
        }
    }

    public void StartConnectingToDevice()
    {
        Task.Run(() => _adapter.StartScanningForDevicesAsync());
    }
}