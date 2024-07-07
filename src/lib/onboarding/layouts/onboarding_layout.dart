import 'package:fitness_machine/onboarding/pages/find_device_page.dart';
import 'package:fitness_machine/onboarding/pages/health_page.dart';
import 'package:fitness_machine/onboarding/pages/height_and_weight_page.dart';
import 'package:fitness_machine/onboarding/pages/welcome_page.dart';
import 'package:flutter/material.dart';

class OnboardingLayout extends StatefulWidget {
  const OnboardingLayout({super.key});



  @override
  State<OnboardingLayout> createState() => _PageViewExampleState();
}

class _PageViewExampleState extends State<OnboardingLayout> {
  late PageController _pageViewController;

  List<Widget> _pages = [
    WelcomePage(),
    // PermissionsPage()?
    HealthPage(),
    HeightAndWeightPage(),
    FindDevicePage(),
  ];
  
  int _currentPageIndex = 0;

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
    return SafeArea(
        child: Scaffold(
            body: Column(children: [
      Expanded(
        child: PageView(
          controller: _pageViewController,
          onPageChanged: (index) {
            setState(() {
              _currentPageIndex = index;
            });
          },
          children: _pages,
        ),
      ),
      const Text("Swipe right to continue"),
      Padding(padding: const EdgeInsets.all(30), child: LinearProgressIndicator(value: _currentPageIndex / (_pages.length - 1))),
      const SizedBox(height: 20),
    ])));
  }
}
