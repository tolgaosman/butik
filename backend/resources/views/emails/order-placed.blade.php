@extends('emails.layout')

@section('title', 'Siparişiniz Alındı')

@section('content')
<p style="margin:0 0 6px; font-size:12px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:#c7175a;">Sipariş Onayı</p>
<h1 style="margin:0 0 18px; font-size:22px; font-weight:600; color:#2b2422;">Teşekkürler, {{ $order->shipping_name }}!</h1>
<p style="margin:0 0 28px; font-size:15px; line-height:1.6; color:#7a6b68;">
<strong style="color:#2b2422;">{{ $order->order_number }}</strong> numaralı siparişiniz alındı ve hazırlanmaya başlayacak. Kargoya verildiğinde ayrıca haberdar edileceksiniz.
</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-bottom:8px;">
<tr>
<td style="padding:0 0 10px; font-size:11px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:#7a6b68; border-bottom:1px solid #ecdfe4;">Ürün</td>
<td align="center" style="padding:0 0 10px; font-size:11px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:#7a6b68; border-bottom:1px solid #ecdfe4;">Adet</td>
<td align="right" style="padding:0 0 10px; font-size:11px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:#7a6b68; border-bottom:1px solid #ecdfe4;">Tutar</td>
</tr>
@foreach ($order->items as $item)
<tr>
<td style="padding:14px 0; font-size:14px; color:#2b2422; border-bottom:1px solid #f7dfe8;">
{{ $item->product_name }}
@if($item->size)<br><span style="font-size:12px; color:#7a6b68;">Beden: {{ $item->size }}</span>@endif
</td>
<td align="center" style="padding:14px 0; font-size:14px; color:#2b2422; border-bottom:1px solid #f7dfe8;">{{ $item->quantity }}</td>
<td align="right" style="padding:14px 0; font-size:14px; color:#2b2422; border-bottom:1px solid #f7dfe8; white-space:nowrap;">{{ number_format($item->line_total_minor / 100, 2, ',', '.') }} ₺</td>
</tr>
@endforeach
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 32px;">
<tr>
<td align="right" style="font-size:16px; font-weight:600; color:#2b2422;">
Toplam&nbsp; <span style="color:#c7175a;">{{ number_format($order->total_minor / 100, 2, ',', '.') }} ₺</span>
</td>
</tr>
</table>

<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
<tr>
<td style="border-radius:999px; background-color:#f53380;">
<a href="https://sevgibutik.com/siparis/{{ $order->order_number }}" style="display:inline-block; padding:13px 30px; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none;">Siparişimi Görüntüle</a>
</td>
</tr>
</table>
@endsection
