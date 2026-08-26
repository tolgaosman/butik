<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Siparişiniz Alındı</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #f53380;">Siparişiniz Alındı!</h2>
        
        <p>Merhaba <strong>{{ $order->shipping_name }}</strong>,</p>
        
        <p>Sevgi Butik'i tercih ettiğiniz için teşekkür ederiz. <strong>#{{ $order->order_number }}</strong> numaralı siparişinizi aldık ve hazırlıklara başladık.</p>
        
        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Sipariş Özeti</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                        {{ $item->product_name }}
                        @if($item->variant_name)
                        <br><small style="color: #666;">Beden: {{ $item->variant_name }}</small>
                        @endif
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: center;">{{ $item->quantity }} Adet</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">{{ number_format($item->unit_price, 2, ',', '.') }} TL</td>
                </tr>
                @endforeach
                <tr>
                    <td colspan="2" style="padding: 10px 0; font-weight: bold; text-align: right;">Genel Toplam:</td>
                    <td style="padding: 10px 0; font-weight: bold; text-align: right;">{{ number_format($order->total, 2, ',', '.') }} TL</td>
                </tr>
            </tbody>
        </table>

        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Teslimat Adresi</h3>
        <p>
            {{ $order->shipping_line1 }}<br>
            @if($order->shipping_line2){{ $order->shipping_line2 }}<br>@endif
            {{ $order->shipping_district }} / {{ $order->shipping_city }}
        </p>

        <p style="margin-top: 30px; font-size: 14px; color: #777;">
            Siparişinizin durumunu "Sipariş Takibi" sayfasından veya üye girişi yaparak hesabınızdan takip edebilirsiniz.<br>
            <a href="{{ env('FRONTEND_URL', 'http://localhost:3000') }}/siparis-takibi" style="color: #f53380; text-decoration: none;">Sipariş Takibi İçin Tıklayın</a>
        </p>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="text-align: center; font-size: 12px; color: #999;">Sevgi Butik, Düzova/Lefkoşa</p>
    </div>
</body>
</html>
