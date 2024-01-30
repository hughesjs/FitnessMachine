using System.Diagnostics;
using System.Reflection.Metadata;
using Plugin.BLE;
using Plugin.BLE.Abstractions.Contracts;

namespace EqiPoc;

public partial class MainPage : ContentPage
{
	private const string DeviceName = "CITYSPORTS-Linker";
	private readonly IAdapter _adapter;
	private IDevice _device;
	
	public MainPage()
	{
		_adapter = CrossBluetoothLE.Current.Adapter;
		InitializeComponent();
	}

	protected override void OnAppearing()
	{
		BluetoothStatusLbl.Text = "Searching for Bluetooth Device";
		_adapter.StartScanningForDevicesAsync();
		_adapter.DeviceDiscovered += (_, e) =>
		{
			if (e.Device.Name == DeviceName)
			{
				_device = e.Device;
				BluetoothStatusLbl.Text = $"Device Found: {_device.Name}\n[{_device.Id}]"; 
				_adapter.StopScanningForDevicesAsync();
			}
		};
	}

	private void OnStartTreadmill(object sender, EventArgs e)
	{
		Console.WriteLine("Starting Treadmill");
	}

	private void OnStopTreadmill(object sender, EventArgs e)
	{
		Console.WriteLine("Stopping Treadmill");
	}
}


