import 'package:get_it/get_it.dart';
import 'package:open_eqi_sports/modules/overview/overview_page.dart';

extension DependencyInjectionExtensions on GetIt {
  GetIt addOverview() {
    registerSingleton<OverviewPage>(const OverviewPage());
    return this;
  }
}
