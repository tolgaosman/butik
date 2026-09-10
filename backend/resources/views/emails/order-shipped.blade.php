@extends('emails.layout')

@section('title', 'Siparişiniz Kargoya Verildi')

@section('content')
<p style="margin:0 0 6px; font-size:12px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:#c7175a;">Kargo Bildirimi</p>
<h1 style="margin:0 0 18px; font-size:22px; font-weight:600; color:#2b2422;">Yola çıktı, {{ $order->shipping_name }}!</h1>
<p style="margin:0 0 28px; font-size:15px; line-height:1.6; color:#7a6b68;">
<strong style="color:#2b2422;">{{ $order->order_number }}</strong> numaralı siparişiniz kargoya verildi.
</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf4f7; border-radius:14px; margin-bottom:32px;">
<tr>
<td style="padding:20px 24px;">
<p style="margin:0 0 4px; font-size:11px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:#7a6b68;">Kargo Takip No</p>
<p style="margin:0; font-size:18px; font-weight:600; letter-spacing:.04em; color:#2b2422;">{{ $order->tracking_number }}</p>
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
