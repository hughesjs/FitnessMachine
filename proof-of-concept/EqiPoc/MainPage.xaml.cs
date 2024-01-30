namespace EqiPoc;

public partial class MainPage : ContentPage
{

	public MainPage()
	{
		InitializeComponent();
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


