import type { NextApiRequest, NextApiResponse } from 'next'
import { isAfter } from 'date-fns';
import { pick } from 'lodash';
import dbConnect from '../../../../../utils/dbConnect';
import Order from '../../../../../models/Order';
import GoogleClient from '../../../../../utils/google';
import { IOrder } from '../../../../../global';
import { timingSafeEqual } from 'crypto';

const adminSecret = process.env.INDOME_ADMIN_SECRET!;

if (!adminSecret) {
  throw new Error('Admin secret not in environment variable!');
}

const getMailBody = (order: IOrder) => `
<!DOCTYPE html>

<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<title></title>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		@media (max-width:520px) {
			.desktop_hide table.icons-inner {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.image_block img.big,
			.row-content {
				width: 100% !important;
			}

			.mobile_hide {
				display: none;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}
		}
	</style>
</head>
<body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
<div align="center" class="alignment" style="line-height:10px"><img class="big" src="https://indomeformprod-rkh4lqqhyq-as.a.run.app/roofrave-banner.png" style="display: block; height: auto; border: 0; width: 500px; max-width: 100%;" width="500"/></div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;text-align:center;">
<h1 style="margin: 0; color: #555555; font-size: 23px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; line-height: 120%; text-align: center; direction: ltr; font-weight: 700; letter-spacing: normal; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">Payment Confirmation</span></h1>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;text-align:center;">
<h2 style="margin: 0; color: #555555; font-size: 18px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; line-height: 120%; text-align: center; direction: ltr; font-weight: 700; letter-spacing: normal; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">InDome Roof Rave 2022</span></h2>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="color:#000000;font-size:14px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:700;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
<p style="margin: 0; margin-bottom: 16px;">Saturday, 17 September 2022</p>
<p style="margin: 0; margin-bottom: 16px;">4pm - 10pm</p>
<p style="margin: 0;"><a href="https://goo.gl/maps/GWkoo3fxLca3Sm7o8" rel="noopener noreferrer" style="color: #0068a5;" target="_blank">13F, Tai Cheong (Liberal) Factory Building, 3 Wing Ming Street, Cheung Sha Wan, Hong Kong</a></p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="divider_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;"><span> </span></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="color:#000000;font-size:14px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:left;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
<p style="margin: 0; margin-bottom: 16px;">Hi ${order.name},</p>
<p style="margin: 0; margin-bottom: 16px;"> </p>
<p style="margin: 0;">We are glad to say that your payment has been confirmed! Your registration details are as follows:</p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="list_block block-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<ul style="margin: 0; padding: 0; margin-left: 20px; list-style-type: revert; color: #000000; font-size: 14px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-weight: 400; line-height: 120%; text-align: left; direction: ltr; letter-spacing: 0px;">
<li style="margin-bottom: 0px;">Name: ${order.name}</li>
<li style="margin-bottom: 0px;">Email: ${order.email}</li>
<li>Phone: ${order.phone}</li>
</ul>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="color:#000000;font-size:14px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:left;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
<p style="margin: 0; margin-bottom: 16px;">We cannot wait to see you in InDome Roof Rave 2022!</p>
<p style="margin: 0; margin-bottom: 16px;"> </p>
<p style="margin: 0;">Cheers,<br/>InDome</p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="divider_block block-9" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;"><span> </span></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-10" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="color:#000000;font-size:14px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:left;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
<p style="margin: 0;">Reminders:</p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="list_block block-11" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<ul style="margin: 0; padding: 0; margin-left: 20px; list-style-type: revert; color: #000000; font-size: 14px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-weight: 400; line-height: 120%; text-align: left; direction: ltr; letter-spacing: 0px;">
<li style="margin-bottom: 0px;">You must be 18 or above on the day of the event.</li>
<li style="margin-bottom: 0px;">On the day of the event, you must present a RAT test and a vaccine pass with "Blue Code" status in the LeaveHomeSafe app. As such, attendees have to be fully vaccinated according to the <a href="https://www.coronavirus.gov.hk/pdf/vp_t1_ENG.pdf" rel="noopener" style="text-decoration: underline; color: #0068a5;" target="_blank">prevailing requirements of the HKSAR government</a>.</li>
<li>Failure to fulfill the above requirements will result in being denied entry and no refund will be given.</li>
</ul>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
<table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="alignment" style="vertical-align: middle; text-align: center;">
<!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table><!-- End -->
</body>
</html>
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req?.method?.toLowerCase() !== 'post') {
    res.status(405).json({
      message: 'Method not allowed!',
    });
    return;  
  }

  const authHeader = req.headers.authorization?.replace('Bearer ', '') ?? '';

  const passLength = adminSecret.length;

  const isAuthenticated = timingSafeEqual(Buffer.from(authHeader.padStart(passLength, '0')), Buffer.from(adminSecret));

  if (!isAuthenticated) {
    res.status(401).json({
      message: 'Unauthorised!',
    });
    return;
  }

  await dbConnect();

  const orderId = req.query.orderId;

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404).json({
      message: 'Not found!',
    });
    return;
  }

  if (!order.filled) {
    res.status(400).json({
      message: 'Order has to be completed first!',
    });
    return;
  }

  await order.update({
    confirmed: true,
  });

  const googleClient = new GoogleClient();
  await googleClient.sendMail({
    to: order.email,
    subject: 'Payment Confirmation - InDome Roof Rave 2022',
    body: getMailBody(order),
  });

  res.status(200).json(order.toJSON());
}
