using EqiPoc.Modules.Bluetooth;
using Plugin.BLE;

namespace EqiPoc;

public partial class MainPage : ContentPage
{
	private const string DeviceName = "CITYSPORTS-Linker";
	private readonly TreadmillController _controller;
	
	public MainPage()
	{
		_controller = new(CrossBluetoothLE.Current.Adapter, DeviceName);
		_controller.TreadmillReady += (_, _) => BluetoothStatusLbl.Text = "Bluetooth: Connected";
		InitializeComponent();
	}
	
	protected override void OnAppearing()
	{
		_controller.StartConnectingToDevice();
	}
	
	private void OnStartTreadmill(object sender, EventArgs e)
	{
		Console.WriteLine("Starting Treadmill");
		_controller.StartTreadmill();
	}

	private void OnStopTreadmill(object sender, EventArgs e)
	{
		Console.WriteLine("Stopping Treadmill");
		_controller.StopTreadmill();
	}

	private void OnDemo(object? sender, EventArgs e)
	{
		Console.WriteLine("Doing Demo");
		_controller.DoDemo();
	}
}


