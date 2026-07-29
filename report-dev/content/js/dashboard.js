/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 87.8048780487805, "KoPercent": 12.195121951219512};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });
    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 41, 5, 12.195121951219512, 186.1463414634146, 84, 649, 141.0, 427.0000000000001, 499.4, 649.0, 7.363505747126436, 278.3171555091595, 9.750015434177444], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 1, 1, 100.0, 97.0, 97, 97, 97.0, 97.0, 97.0, 97.0, 10.309278350515465, 8.698453608247423, 16.702239046391753], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 1, 0, 0.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 27.79296875, 15.048828125], "isController": false}, {"data": ["16. POST /admin/api/v1/order/query", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 184.77957589285714, 10.172526041666666], "isController": false}, {"data": ["36. POST /widget/api/v1/event/{eventId}/root-tickets", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 6.590594211822659, 2.766125307881773], "isController": false}, {"data": ["20. POST /admin/api/v1/legalentity/query", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 819.8626482928241, 3.619158709490741], "isController": false}, {"data": ["07. POST /admin/api/v1/event/query", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 268.78624355670104, 3.159230025773196], "isController": false}, {"data": ["02. POST /admin/api/v1/state/query", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 70.62245244565217, 6.661854619565217], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 1, 0, 0.0, 141.0, 141, 141, 141.0, 141.0, 141.0, 141.0, 7.092198581560283, 310.74772828014187, 11.067708333333334], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 548.9792882371007, 5.134751228501229], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 1, 0, 0.0, 116.0, 116, 116, 116.0, 116.0, 116.0, 116.0, 8.620689655172413, 4.39453125, 4.2682516163793105], "isController": false}, {"data": ["09. POST /admin/api/v1/tariff/query", 1, 0, 0.0, 127.0, 127, 127, 127.0, 127.0, 127.0, 127.0, 7.874015748031496, 301.9731176181102, 11.749507874015748], "isController": false}, {"data": ["26. POST /admin/api/v1/template-group/query", 1, 0, 0.0, 119.0, 119, 119, 119.0, 119.0, 119.0, 119.0, 8.403361344537815, 163.20082720588235, 13.179490546218489], "isController": false}, {"data": ["28. POST /admin/api/v1/pushkaGateway/query", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 6.7506067961165055, 14.553625606796118], "isController": false}, {"data": ["23. POST /admin/api/v1/invitation/query", 1, 0, 0.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 554.228515625, 15.68359375], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 1, 1, 100.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 9.181810461956522, 17.365828804347828], "isController": false}, {"data": ["37. POST /widget/api/v1/cart", 1, 0, 0.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 4.892578125, 4.84375], "isController": false}, {"data": ["25. POST /admin/api/v1/paypoint/query", 1, 0, 0.0, 146.0, 146, 146, 146.0, 146.0, 146.0, 146.0, 6.8493150684931505, 461.111408390411, 10.688677226027398], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 1, 1, 100.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 20.6078506097561, 3.0154344512195124], "isController": false}, {"data": ["04. POST /admin/api/v1/venue/query", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 333.4765625, 6.1171875], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 256.9781553398058, 14.93287317961165], "isController": false}, {"data": ["19. POST /admin/api/v1/customer/query", 1, 0, 0.0, 109.0, 109, 109, 109.0, 109.0, 109.0, 109.0, 9.174311926605505, 529.4402236238532, 14.71115252293578], "isController": false}, {"data": ["22. POST /admin/api/v1/user/query", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 225.9837962962963, 14.250578703703704], "isController": false}, {"data": ["06. POST /admin/api/v1/show/query", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 7.4611441798941796, 8.453207671957673], "isController": false}, {"data": ["24. POST /admin/api/v1/gateway/query", 1, 0, 0.0, 125.0, 125, 125, 125.0, 125.0, 125.0, 125.0, 8.0, 346.0078125, 11.9453125], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 1, 1, 100.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 9.314903846153847, 16.665951236263737], "isController": false}, {"data": ["21. POST /admin/api/v1/contract/query", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 307.64633861940297, 7.666744402985074], "isController": false}, {"data": ["30. POST /admin/api/v1/sender-settings/query", 1, 0, 0.0, 149.0, 149, 149, 149.0, 149.0, 149.0, 149.0, 6.7114093959731544, 359.6437185402685, 10.388265520134228], "isController": false}, {"data": ["32. GET /widget/api/v1/show/{showId}", 1, 0, 0.0, 649.0, 649, 649, 649.0, 649.0, 649.0, 649.0, 1.5408320493066257, 1.5363178929121726, 0.7493499614791987], "isController": false}, {"data": ["33. POST /widget/api/v1/event/tabs/query", 1, 0, 0.0, 124.0, 124, 124, 124.0, 124.0, 124.0, 124.0, 8.064516129032258, 4.748928931451613, 4.331527217741936], "isController": false}, {"data": ["34. POST /widget/api/v1/event/tabs/events/query", 1, 0, 0.0, 119.0, 119, 119, 119.0, 119.0, 119.0, 119.0, 8.403361344537815, 8.608521533613446, 5.08797268907563], "isController": false}, {"data": ["41. POST /widget/api/v1/order", 1, 1, 100.0, 145.0, 145, 145, 145.0, 145.0, 145.0, 145.0, 6.896551724137931, 198.26912715517244, 5.408135775862069], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 1, 0, 0.0, 146.0, 146, 146, 146.0, 146.0, 146.0, 146.0, 6.8493150684931505, 36.29334332191781, 11.625107020547945], "isController": false}, {"data": ["35. GET /widget/api/v1/event/{eventId}", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 6.887967469262295, 1.9971503586065573], "isController": false}, {"data": ["39. GET /widget/api/v1/cart/{cartId}", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 4.062084441489362, 2.586851728723404], "isController": false}, {"data": ["01. POST /admin/api/v1/country/query", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 7.75597243013972, 2.980367390219561], "isController": false}, {"data": ["31. POST /admin/api/v1/progressbar/query", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 247.5818452380952, 17.822265625], "isController": false}, {"data": ["08. POST /admin/api/v1/age-raiting/query", 1, 0, 0.0, 121.0, 121, 121, 121.0, 121.0, 121.0, 121.0, 8.264462809917356, 248.17600723140495, 12.75987861570248], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 1, 0, 0.0, 127.0, 127, 127, 127.0, 127.0, 127.0, 127.0, 7.874015748031496, 282.7417568897638, 12.341596948818898], "isController": false}, {"data": ["18. POST /admin/api/v1/cart/query", 1, 0, 0.0, 115.0, 115, 115, 115.0, 115.0, 115.0, 115.0, 8.695652173913043, 16.508152173913043, 13.485054347826086], "isController": false}, {"data": ["05. POST /admin/api/v1/hall/query", 1, 0, 0.0, 147.0, 147, 147, 147.0, 147.0, 147.0, 147.0, 6.802721088435374, 276.28746811224494, 10.589392006802722], "isController": false}, {"data": ["03. POST /admin/api/v1/city/query", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 147.0331512721239, 6.775442477876106], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 4, 80.0, 9.75609756097561], "isController": false}, {"data": ["422/Unprocessable Entity", 1, 20.0, 2.4390243902439024], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 41, 5, "500/Internal Server Error", 4, "422/Unprocessable Entity", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 1, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 1, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 1, 1, "422/Unprocessable Entity", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 1, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["41. POST /widget/api/v1/order", 1, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
