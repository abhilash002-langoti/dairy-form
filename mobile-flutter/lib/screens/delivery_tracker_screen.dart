import 'package:flutter/material.dart';

class DeliveryTrackerScreen extends StatelessWidget {
  const DeliveryTrackerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Delivery Tracker'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('TODAY\'S MORNING RUN', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF16A34A))),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(color: const Color(0xFFE0F2FE), borderRadius: BorderRadius.circular(12)),
                        child: const Text('OUT FOR DELIVERY', style: TextStyle(color: Color(0xFF0369A1), fontWeight: FontWeight.bold, fontSize: 11)),
                      )
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text('1L Pure A2 Gir Cow Milk', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
                  const Text('Assigned: Mahesh Kumar (KA-01-EQ-4421)', style: TextStyle(color: Colors.grey, fontSize: 13)),
                  const SizedBox(height: 20),

                  // Steps
                  _buildTrackerStep('1. Milked at Farm', '4:30 AM (Nelamangala)', true),
                  _buildTrackerStep('2. Rapidly Chilled to 4°C', '4:45 AM (Halted bacteria)', true),
                  _buildTrackerStep('3. Lab Tested Purity', '5:05 AM (Fat 4.6%, SNF 8.9%)', true),
                  _buildTrackerStep('4. On Route in Chilled EV', '5:40 AM (Est arrival 6:15 AM)', true, isCurrent: true),
                  _buildTrackerStep('5. Delivered at Doorstep', 'Pending morning drop', false),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTrackerStep(String title, String time, bool isDone, {bool isCurrent = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          CircleAvatar(
            radius: 14,
            backgroundColor: isDone ? (isCurrent ? Colors.blue : const Color(0xFF16A34A)) : Colors.grey[300],
            child: Icon(
              isDone ? (isCurrent ? Icons.delivery_dining : Icons.check) : Icons.circle,
              size: 16,
              color: isDone ? Colors.white : Colors.grey,
            ),
          ),
          const SizedBox(width: 14),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: isCurrent ? Colors.blue[900] : Colors.black)),
              Text(time, style: const TextStyle(fontSize: 12, color: Colors.grey)),
            ],
          )
        ],
      ),
    );
  }
}
