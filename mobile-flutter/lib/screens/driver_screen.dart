import 'package:flutter/material.dart';

class DriverScreen extends StatefulWidget {
  const DriverScreen({super.key});

  @override
  State<DriverScreen> createState() => _DriverScreenState();
}

class _DriverScreenState extends State<DriverScreen> {
  final List<Map<String, dynamic>> _stops = [
    {
      'stopNo': 1,
      'name': 'Ananya Sharma',
      'phone': '+91 98450 12345',
      'address': 'Flat 402, Green Glen Layout, Bellandur',
      'items': '1L Pure A2 Desi Gir Cow Milk',
      'delivered': false,
    },
    {
      'stopNo': 2,
      'name': 'Rajesh Kulkarni',
      'phone': '+91 97400 56789',
      'address': '#88, 14th Main, 4th Sector, HSR Layout',
      'items': '2L Creamy Murrah Buffalo Milk',
      'delivered': true,
    },
    {
      'stopNo': 3,
      'name': 'Sunil Verma',
      'phone': '+91 99000 78901',
      'address': 'Villa 12, Palm Meadows, Whitefield',
      'items': '500ml Bilona Ghee + 200g Paneer',
      'delivered': false,
    }
  ];

  void _markDelivered(int index) {
    setState(() {
      _stops[index]['delivered'] = true;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Marked Stop #${_stops[index]['stopNo']} as Delivered!')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Driver Route Run (Route A)'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _stops.length,
        itemBuilder: (context, idx) {
          final s = _stops[idx];
          final isDelivered = s['delivered'] as bool;

          return Card(
            margin: const EdgeInsets.only(bottom: 14),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: BorderSide(color: isDelivered ? Colors.green : Colors.grey.shade300),
            ),
            color: isDelivered ? const Color(0xFFF0FDF4) : Colors.white,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('STOP #${s['stopNo']}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.grey)),
                      Text(
                        isDelivered ? 'DELIVERED' : 'PENDING',
                        style: TextStyle(fontWeight: FontWeight.w900, color: isDelivered ? Colors.green : Colors.orange),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(s['name'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  Text(s['address'], style: const TextStyle(color: Colors.black87, fontSize: 13)),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(color: Colors.grey[100], borderRadius: BorderRadius.circular(8)),
                    child: Text('📦 ${s['items']}', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                  ),
                  const SizedBox(height: 12),
                  if (!isDelivered)
                    Row(
                      children: [
                        ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF16A34A), foregroundColor: Colors.white),
                          onPressed: () => _markDelivered(idx),
                          icon: const Icon(Icons.check, size: 18),
                          label: const Text('Mark Delivered'),
                        ),
                        const SizedBox(width: 8),
                        OutlinedButton(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Displaying Dynamic UPI QR Code for Customer Scan')),
                            );
                          },
                          child: const Text('UPI QR'),
                        )
                      ],
                    )
                  else
                    const Text('✓ Bottle delivered & empty glass bottle collected.', style: TextStyle(color: Colors.green, fontSize: 12, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
