<?php
// if obtain request "POST" do...
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // use this code if you want to respond back using json
    header("Content-Type: application/json");
    //take the domain value from POST and print message
    $domain = $_POST["domain"] ?? '';
    //echo htmlspecialchars($domain);
    if (strpos($domain, '.') !== false){
        // send API request to google DNS and obtain response in $apiUrl
        $apiUrl = "https://dns.google/resolve?name=" . urlencode($domain) . "&type=A";
        // json file is stored in $response
        $response = file_get_contents($apiUrl);
        // decode the json file and store in $data
        $data = json_decode($response, true);
        // recive the number of awenser (how many ip addresses)
        $answers = $data["Answer"];
        $status = $data["Status"]; // 0 = ok, 3 = no exist, 2 = dns server fail
        // create a list named $result
        $result = [];

        // read each answers as $entry
        foreach($answers as $entry){
            // define every element in the answers
            // rtrim delete the last dot (.com.)
            $name = rtrim($entry["name"], '.');
            $ip = $entry["data"];
            $TTL = $entry["TTL"];
            $type = $entry["type"];
            // convert every record type number in his record type name
            switch($type){
                case 1:
                    $type = "A";
                    break;
                case 2:
                    $type = "NS";
                    break;
                case 5:
                    $type = "CNAME";
                    break;
                case 6:
                    $type = "SOA";
                    break;
                case 12:
                    $type = "PTR";
                    break;
                case 15:
                    $type = "MX";
                    break;
                case 16:
                    $type = "TXT";
                    break;
                case 28:
                    $type = "AAAA";
                    break;
                case 33:
                    $type = "SRV";
                    break;
                case 35:
                    $type = "NAPTR";
                    break;
                case 257:
                    $type = "CAA";
                    break;

            }
            // after all that put every response in this list
            $result_list[] = [
                "name" => $name,
                "ip" => $ip,
                "ttl" => $TTL,
                "type" => $type
            ];

                
        
        }
        
        // make a json file and send to the user (JS)
        echo json_encode([
            "status" => $status,
            "records" => $result_list
        ]);
        
        
    }else{
        // if is not an DNS address send a json error message
        echo json_encode([
            "status" => "invalid",
            "message" => "Invalid DNS"
        ]);
    }
}
?>

