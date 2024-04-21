import 'package:get_it/get_it.dart';
import 'package:fitness_machine/modules/overview/overview_page.dart';

extension DependencyInjectionExtensions on GetIt {
  GetIt addOverview() {
    registerSingleton<OverviewPage>(const OverviewPage());
    return this;
  }
}
