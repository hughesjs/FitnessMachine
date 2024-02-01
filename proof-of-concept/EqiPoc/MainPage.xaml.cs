using EqiPoc.Modules.Bluetooth;
using EqiPoc.Modules.Workout;
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
		_controller.WorkoutStatusUpdated += OnWorkoutStatusUpdated;
		InitializeComponent();
	}

	private void OnWorkoutStatusUpdated(object? sender, WorkoutStatus e)
	{
			SpeedLbl.Text = $"Speed: {e.SpeedInKmh} (kmh\u207b\u00b9):";
			DistanceLbl.Text = $"Distance: {e.DistanceInKm} (km)";
			TimeLbl.Text = $"Time: {e.TimeInSeconds} (s)";
			CaloriesLbl.Text = $"Indicated Calories: {e.IndicatedCalories} (kcal)";
			StepsLbl.Text = $"Steps: {e.Steps}";
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

	private void OnSlowTreadmill(object? sender, EventArgs e)
	{
		Console.WriteLine("Slowing Treadmill");
		_controller.SlowDownTreadmill();
	}

	private void OnSpeedTreadmill(object? sender, EventArgs e)
	{
		Console.WriteLine("Speeding Up Treadmill");
		_controller.SpeedUpTreadmill();
	}
}


