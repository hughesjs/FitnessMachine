namespace OpenEqiSports.DependencyInjection;

public static class DependencyInjectionExtensions
{
    public static IServiceCollection AddFrontend(this IServiceCollection services)
    {
        services.AddSingleton<AppShell>();
        services.AddSingleton<MainPage>();
        return services;
    }
}