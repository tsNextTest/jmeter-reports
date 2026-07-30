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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 41, 5, 12.195121951219512, 296.07317073170736, 96, 1325, 203.0, 701.8000000000006, 967.1999999999996, 1325.0, 4.300849680058744, 162.447632565824, 5.694753586226791], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 1, 1, 100.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 8.502998737373737, 16.364820075757574], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 1, 0, 0.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 27.248008578431374, 14.75375306372549], "isController": false}, {"data": ["16. POST /admin/api/v1/order/query", 1, 0, 0.0, 314.0, 314, 314, 314.0, 314.0, 314.0, 314.0, 3.1847133757961785, 98.86606787420382, 5.442625398089172], "isController": false}, {"data": ["36. POST /widget/api/v1/event/{eventId}/root-tickets", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 2.6831005761523046, 1.1252974699398797], "isController": false}, {"data": ["20. POST /admin/api/v1/legalentity/query", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 626.6074391592921, 2.767215154867257], "isController": false}, {"data": ["07. POST /admin/api/v1/event/query", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 229.10259226713535, 2.69284105887522], "isController": false}, {"data": ["02. POST /admin/api/v1/state/query", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 81.62394001256281, 7.699630967336683], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 213.73380335365854, 7.612423780487806], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 1, 0, 0.0, 993.0, 993, 993, 993.0, 993.0, 993.0, 993.0, 1.0070493454179255, 225.00963777693858, 2.1045757804632426], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 2.5876427664974617, 2.5132852157360404], "isController": false}, {"data": ["09. POST /admin/api/v1/tariff/query", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 113.80285608308604, 4.427856083086053], "isController": false}, {"data": ["26. POST /admin/api/v1/template-group/query", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 62.05071884984026, 5.010732827476039], "isController": false}, {"data": ["28. POST /admin/api/v1/pushkaGateway/query", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 2.3683301445578233, 5.098719175170069], "isController": false}, {"data": ["23. POST /admin/api/v1/invitation/query", 1, 0, 0.0, 124.0, 124, 124, 124.0, 124.0, 124.0, 124.0, 8.064516129032258, 446.9663558467742, 12.648059475806452], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 1, 1, 100.0, 96.0, 96, 96, 96.0, 96.0, 96.0, 96.0, 10.416666666666666, 8.799235026041666, 16.642252604166668], "isController": false}, {"data": ["37. POST /widget/api/v1/cart", 1, 0, 0.0, 116.0, 116, 116, 116.0, 116.0, 116.0, 116.0, 8.620689655172413, 4.234577047413793, 4.175646551724138], "isController": false}, {"data": ["25. POST /admin/api/v1/paypoint/query", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 307.4031464041096, 7.125784817351598], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 1, 1, 100.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 20.31062199519231, 2.971942608173077], "isController": false}, {"data": ["04. POST /admin/api/v1/venue/query", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 271.5607186482085, 4.981423045602606], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 249.70518867924528, 14.510244693396228], "isController": false}, {"data": ["19. POST /admin/api/v1/customer/query", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 341.47328032544374, 9.488258136094673], "isController": false}, {"data": ["22. POST /admin/api/v1/user/query", 1, 0, 0.0, 97.0, 97, 97, 97.0, 97.0, 97.0, 97.0, 10.309278350515465, 252.37596649484536, 15.866623711340205], "isController": false}, {"data": ["06. POST /admin/api/v1/show/query", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 4.626664959016393, 5.238217213114754], "isController": false}, {"data": ["24. POST /admin/api/v1/gateway/query", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 157.27982954545453, 5.4296875], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 8.392636138613861, 15.015857054455445], "isController": false}, {"data": ["21. POST /admin/api/v1/contract/query", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 328.9145611702128, 8.196891622340425], "isController": false}, {"data": ["30. POST /admin/api/v1/sender-settings/query", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 309.7509483381503, 8.947118858381504], "isController": false}, {"data": ["32. GET /widget/api/v1/show/{showId}", 1, 0, 0.0, 735.0, 735, 735, 735.0, 735.0, 735.0, 735.0, 1.3605442176870748, 1.3565582482993197, 0.6616709183673469], "isController": false}, {"data": ["33. POST /widget/api/v1/event/tabs/query", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 3.0993009868421053, 2.8268914473684212], "isController": false}, {"data": ["34. POST /widget/api/v1/event/tabs/events/query", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 5.1318359375, 3.02734375], "isController": false}, {"data": ["41. POST /widget/api/v1/order", 1, 1, 100.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 143.02996735074626, 3.901391480099502], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 22.174915010460253, 7.101529811715482], "isController": false}, {"data": ["35. GET /widget/api/v1/event/{eventId}", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 8.233762254901961, 2.3887484681372553], "isController": false}, {"data": ["39. GET /widget/api/v1/cart/{cartId}", 1, 0, 0.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 7.486979166666667, 4.767922794117648], "isController": false}, {"data": ["01. POST /admin/api/v1/country/query", 1, 0, 0.0, 735.0, 735, 735, 735.0, 735.0, 735.0, 735.0, 1.3605442176870748, 5.286724064625851, 2.031515731292517], "isController": false}, {"data": ["31. POST /admin/api/v1/progressbar/query", 1, 0, 0.0, 135.0, 135, 135, 135.0, 135.0, 135.0, 135.0, 7.407407407407407, 154.05092592592592, 11.089409722222221], "isController": false}, {"data": ["08. POST /admin/api/v1/age-raiting/query", 1, 0, 0.0, 109.0, 109, 109, 109.0, 109.0, 109.0, 109.0, 9.174311926605505, 275.49813646788994, 14.164635894495413], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 89.77294921875, 3.91845703125], "isController": false}, {"data": ["18. POST /admin/api/v1/cart/query", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 4.744764397905759, 8.119273560209423], "isController": false}, {"data": ["05. POST /admin/api/v1/hall/query", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 200.07023552955664, 7.668180418719212], "isController": false}, {"data": ["03. POST /admin/api/v1/city/query", 1, 0, 0.0, 1325.0, 1325, 1325, 1325.0, 1325.0, 1325.0, 1325.0, 0.7547169811320754, 25.08033608490566, 1.1556603773584906], "isController": false}]}, function(index, item){
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
