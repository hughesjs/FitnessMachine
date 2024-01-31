using EqiPoc.Modules.Bluetooth;
using Plugin.BLE;
using Plugin.BLE.Abstractions.Contracts;

namespace EqiPoc;

public partial class MainPage : ContentPage
{
	private const string DeviceName = "CITYSPORTS-Linker";
	private readonly TreadmillController _controller;
	
	public MainPage()
	{
		_controller = new(CrossBluetoothLE.Current.Adapter, DeviceName);
		_controller.TreadmillReady += (_, _) => BluetoothStatusLbl.Text = "Connected";
		InitializeComponent();
	}
	
	protected override void OnAppearing()
	{
		_controller.StartConnectingToDevice();
	}
	

	private async void OnStartTreadmill(object sender, EventArgs e)
	{
		Console.WriteLine("Starting Treadmill");
		//var res = await _control!.WriteAsync(new byte[] {0x00});
		//Console.WriteLine(res);
		
	}

	private void OnStopTreadmill(object sender, EventArgs e)
	{
		Console.WriteLine("Stopping Treadmill");
	}

	private void OnDebug(object? sender, EventArgs e)
	{
		Task.Run(async () => await _controller.HitEveryCharacteristic());
	}
}


