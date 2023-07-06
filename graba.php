<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
$output = [];
try{
	$audio = isset($_POST['audio']) ? trim(strip_tags($_POST['audio'])) : false; 
	if($audio == false){
		throw new Exception('debe enviar audio');
	}

		$output['success'] = true;
		$output['time'] = time();
		$output['audio'] = $audio;
		$output['code'] = 200;

$airtable_key = 'patN98dG2Ckp2ZsUr.e22562cdd9c42b5770d9f06289046ac70f44dbb64606643def4c063ebc1046ab';
$akey = 'keyKl0X9spU4v0zH7';

// URL generated by the docs
$url = 'https://api.airtable.com/v0/appLwEBTSxgVddGOi/recordd.live';

$data = array(
    "fields" => array(
        "Name" => "Recordd.live",
        "Audio" => $audio,
    )
);
$data_json = json_encode($data);

$curl = $url."?api_key=".$akey;

//$output['curl'] = $curl;

$ch = curl_init($url."?api_key=".$akey);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_json);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json'
));

$result = curl_exec($ch);

/*$headers = [
  'Content-Type: application/json',
  'Authorization: Bearer ' . $akey,    
];

// this is the JSON-encoded record to write to the table
$post = '{"fields": {"Name": "Stoyan", "Email": "ssttoo@ymail.com"}}';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST,1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$result = curl_exec($ch);*/
curl_close($ch);

$output['msg'] = $result;

} catch (Exception $e) {
	$output['success'] = false;
	$output['msg'] = $e->getMessage();
    $output['audio'] = '';
    $output['code'] = !empty($e->getCode()) ? $e->getCode() : 500;
}
http_response_code($output['code']);
echo json_encode($output);
