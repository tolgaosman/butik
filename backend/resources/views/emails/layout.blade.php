<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>@yield('title', 'Sevgi Butik')</title>
</head>
<body style="margin:0; padding:0; background-color:#fdf4f7; font-family:'Raleway', Helvetica, Arial, sans-serif; color:#2b2422;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf4f7;">
<tr>
<td align="center" style="padding:40px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr>
<td align="center" style="padding-bottom:28px;">
<img src="{{ rtrim(config('app.url'), '/') }}/sevgiLogo-ink.png" alt="Sevgi Butik" width="132" style="display:block; width:132px; height:auto;">
</td>
</tr>
<tr>
<td style="background-color:#ffffff; border:1px solid #ecdfe4; border-radius:20px; padding:40px 36px;">
@yield('content')
</td>
</tr>
<tr>
<td align="center" style="padding-top:28px;">
<p style="margin:0; font-size:12px; line-height:1.6; color:#7a6b68;">Sevgi Butik &middot; D&uuml;zova, Lefko&#351;a</p>
<p style="margin:6px 0 0; font-size:12px;">
<a href="https://sevgibutik.com" style="color:#c7175a; text-decoration:none;">sevgibutik.com</a>
</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>
