@component('mail::message')
# Siparişiniz Kargoya Verildi

Merhaba {{ $order->shipping_name }},

**{{ $order->order_number }}** numaralı siparişiniz kargoya verilmiştir.

Kargo Takip No: **{{ $order->tracking_number }}**

Teşekkürler,<br>
Sevgi Butik
@endcomponent
