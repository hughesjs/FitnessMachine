import 'package:fitness_machine/onboarding/pages/find_device_page.dart';
import 'package:fitness_machine/onboarding/pages/health_page.dart';
import 'package:fitness_machine/onboarding/pages/height_and_weight_page.dart';
import 'package:fitness_machine/onboarding/pages/welcome_page.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';


class OnboardingLayout extends StatefulWidget {
  const OnboardingLayout({super.key});

  @override
  State<OnboardingLayout> createState() => _PageViewExampleState();
}

class _PageViewExampleState extends State<OnboardingLayout> {

  late PageController _pageViewController;

  @override
  void initState() {
    super.initState();
    _pageViewController = PageController();
  }

  @override
  void dispose() {
    super.dispose();
    _pageViewController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return PageView(
          /// [PageView.scrollDirection] defaults to [Axis.horizontal].
          /// Use [Axis.vertical] to scroll vertically.
          controller: _pageViewController,
          onPageChanged: null,
          children: const <Widget>[
            WelcomePage(),
            // PermissionsPage()?
            HealthPage(),
            HeightAndWeightPage(),
            FindDevicePage(),
          ],
        );
  }
}