@component('mail::message')
# Siparişiniz Alındı

Merhaba {{ $order->shipping_name }},

**{{ $order->order_number }}** numaralı siparişiniz alınmıştır.

@component('mail::table')
| Ürün | Beden | Adet | Tutar |
| :--- | :---: | :---: | ---: |
@foreach ($order->items as $item)
| {{ $item->product_name }} | {{ $item->size ?? '-' }} | {{ $item->quantity }} | {{ number_format($item->line_total_minor / 100, 2, ',', '.') }} ₺ |
@endforeach
@endcomponent

**Toplam: {{ number_format($order->total_minor / 100, 2, ',', '.') }} ₺**

Sipariş durumunuzu {{ $order->order_number }} numarası ve e-posta adresinizle takip edebilirsiniz.

Teşekkürler,<br>
Sevgi Butik
@endcomponent
