import 'package:fitness_machine/layouts/page_definition.dart';

class PageDefinitionProvider {
  final Set<PageDefinition> _pageDefinitions;

  const PageDefinitionProvider(this._pageDefinitions);

  Set<PageDefinition> getPageDefinitions() {
    return _pageDefinitions;
  }
}
