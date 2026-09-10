@extends('emails.layout')

@section('title', 'Şifre Sıfırlama Kodu')

@section('content')
<p style="margin:0 0 6px; font-size:12px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:#c7175a;">Hesap Güvenliği</p>
<h1 style="margin:0 0 18px; font-size:22px; font-weight:600; color:#2b2422;">Şifre Sıfırlama Kodunuz</h1>
<p style="margin:0 0 28px; font-size:15px; line-height:1.6; color:#7a6b68;">
Sevgi Butik hesabınızın şifresini sıfırlamak için bir talepte bulundunuz. Devam etmek için aşağıdaki kodu kullanın.
</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf4f7; border-radius:14px; margin-bottom:20px;">
<tr>
<td align="center" style="padding:24px;">
<span style="font-size:32px; font-weight:700; letter-spacing:.3em; color:#c7175a;">{{ $code }}</span>
</td>
</tr>
</table>

<p style="margin:0 0 4px; font-size:13px; color:#7a6b68;">Bu kod 10 dakika boyunca geçerlidir.</p>
<p style="margin:0; font-size:13px; color:#7a6b68;">Bu talebi siz oluşturmadıysanız bu e-postayı görmezden gelebilirsiniz.</p>
@endsection
