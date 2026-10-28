import 'package:flutter/material.dart';
import 'screens/farm_erp_screen.dart';

void main() {
  runApp(const AmritDairyApp());
}

class AmritDairyApp extends StatelessWidget {
  const AmritDairyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Amrit Dairy Farm - Management System',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF16A34A),
          primary: const Color(0xFF16A34A),
          secondary: const Color(0xFF0284C7),
          surface: Colors.white,
          background: const Color(0xFFF8FAFC),
        ),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: Color(0xFF0F172A),
          elevation: 1,
          titleTextStyle: TextStyle(
            fontWeight: FontWeight.w900,
            fontSize: 18,
            color: Color(0xFF14532D),
          ),
        ),
      ),
      home: const FarmErpScreen(),
    );
  }
}
