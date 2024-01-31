using Plugin.BLE;
using Plugin.BLE.Abstractions.Contracts;

namespace EqiPoc;

public partial class MainPage : ContentPage
{
	private const string DeviceName = "CITYSPORTS-Linker";
	private readonly IAdapter? _adapter;
	private IDevice? _device;
	private ICharacteristic? _control;
	private ICharacteristic? _status;
	
	
	
	public MainPage()
	{
		_adapter = CrossBluetoothLE.Current.Adapter;
		InitializeComponent();
	}

	// TODO - Sort the async stuff out
	protected override void OnAppearing()
	{
		Task.Run(ConnectToDevice);
	}
	
	private async Task ConnectToDevice()
	{
		if (_adapter is null)
		{
			BluetoothStatusLbl.Text = "Bluetooth Adapter not found";
			return;
		}
		BluetoothStatusLbl.Text = "Searching for Bluetooth Device";
		_adapter.DeviceDiscovered += async (_, e) =>
		{
			if (e.Device.Name == DeviceName)
			{
				_device = e.Device;
				BluetoothStatusLbl.Text = $"Device Found: {_device.Name}\n[{_device.Id}]"; 
				await _adapter.StopScanningForDevicesAsync();
				await _adapter.ConnectToDeviceAsync(_device);
				var s = await _device.GetServicesAsync();

				// Can this be parallellized?
				// TODO - Make less gross
				foreach (IService service in s)
				{
					var chars = await service.GetCharacteristicsAsync();
					foreach (var characteristic in chars)
					{
						if (characteristic.Uuid == "2ad9")
						{
							_control = characteristic;
							continue;
						}

						if (characteristic.Uuid == "2acd")
						{
							_status = characteristic;
							continue;
						}
					}
				}

				if (_control is not null && _status is not null)
				{
					BluetoothStatusLbl.Text = "Device Connected";
				}
			}
		};
		await _adapter.StartScanningForDevicesAsync();
	}

	private async void OnStartTreadmill(object sender, EventArgs e)
	{
		Console.WriteLine("Starting Treadmill");
		var res = await _control!.WriteAsync(new byte[] {0x00});
		Console.WriteLine(res);
		
	}

	private void OnStopTreadmill(object sender, EventArgs e)
	{
		Console.WriteLine("Stopping Treadmill");
	}

	protected override void OnDisappearing()
	{
		Disconnect();
	}
	
	private void Disconnect()
	{
		Console.WriteLine("Disconnecting from device");
		_adapter?.DisconnectDeviceAsync(_device).Wait();
		_device = null;
		_control = null;
		_status = null;
		Console.WriteLine("Disconnected from device");
	}
	
	private void OnDisconnectTreadmill(object? sender, EventArgs e)
	{
		Disconnect();
	}
}


