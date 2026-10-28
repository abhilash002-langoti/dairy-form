import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/subscription.dart';
import '../services/api_service.dart';

class SubscriptionScreen extends StatefulWidget {
  const SubscriptionScreen({super.key});

  @override
  State<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends State<SubscriptionScreen> {
  List<SubscriptionItem> _subs = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadSubs();
  }

  Future<void> _loadSubs() async {
    try {
      final items = await ApiService.fetchSubscriptions('cust-1');
      setState(() {
        _subs = items;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _toggleDate(String dateStr) async {
    if (_subs.isEmpty) return;
    final sub = _subs.first;
    await ApiService.toggleSkipDate(sub.id, dateStr);
    _loadSubs();
  }

  @override
  Widget build(BuildContext context) {
    final sub = _subs.isNotEmpty ? _subs.first : null;
    final skipped = sub?.skippedDates ?? [];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Subscriptions & Vacation Pause'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (sub != null) ...[
                    Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.04),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          )
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFDCFCE7),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Text(
                                  sub.status.toUpperCase(),
                                  style: const TextStyle(
                                    color: Color(0xFF166534),
                                    fontSize: 11,
                                    fontWeight: FontWeight.w900,
                                  ),
                                ),
                              ),
                              Text(
                                '₹${(sub.unitPrice * sub.quantity).toInt()} / day',
                                style: const TextStyle(
                                  fontWeight: FontWeight.w900,
                                  fontSize: 17,
                                  color: Color(0xFF15803D),
                                ),
                              )
                            ],
                          ),
                          const SizedBox(height: 10),
                          Text(
                            sub.productName,
                            style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${sub.frequency.toUpperCase()} • ${sub.quantity} Litre • Morning Slot (5:30 - 7:30 AM)',
                            style: const TextStyle(color: Colors.grey, fontSize: 13),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            '📍 ${sub.deliveryAddress}',
                            style: const TextStyle(fontSize: 12, color: Color(0xFF475569)),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Calendar Pause Guide
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF0FDF4),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFBBF7D0)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            '📅 Tap Any Date to Pause / Resume Delivery',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF166534)),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'Going out of town? Tap the date to skip. Green = Active, Red = Paused.',
                            style: TextStyle(fontSize: 12, color: Color(0xFF334155)),
                          ),
                          const SizedBox(height: 16),

                          // 14-day interactive grid
                          GridView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: 14,
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 7,
                              childAspectRatio: 0.85,
                              crossAxisSpacing: 6,
                              mainAxisSpacing: 6,
                            ),
                            itemBuilder: (context, index) {
                              final d = DateTime.now().add(Duration(days: index + 1));
                              final dateStr = DateFormat('yyyy-MM-dd').format(d);
                              final dayName = DateFormat('E').format(d);
                              final dayNum = DateFormat('d').format(d);
                              final isSkipped = skipped.contains(dateStr);

                              return GestureDetector(
                                onTap: () => _toggleDate(dateStr),
                                child: Container(
                                  decoration: BoxDecoration(
                                    color: isSkipped ? const Color(0xFFFEE2E2) : Colors.white,
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(
                                      color: isSkipped ? const Color(0xFFFCA5A5) : const Color(0xFF86EFAC),
                                    ),
                                  ),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        dayName,
                                        style: TextStyle(
                                          fontSize: 10,
                                          color: isSkipped ? Colors.red[800] : Colors.green[800],
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      Text(
                                        dayNum,
                                        style: TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.w900,
                                          color: isSkipped ? Colors.red[900] : const Color(0xFF0F172A),
                                          decoration: isSkipped ? TextDecoration.lineThrough : null,
                                        ),
                                      ),
                                      Container(
                                        width: 5,
                                        height: 5,
                                        margin: const EdgeInsets.only(top: 2),
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          color: isSkipped ? Colors.red : Colors.green,
                                        ),
                                      )
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  ] else ...[
                    const Center(
                      child: Text('No active subscriptions found.'),
                    )
                  ]
                ],
              ),
            ),
    );
  }
}
