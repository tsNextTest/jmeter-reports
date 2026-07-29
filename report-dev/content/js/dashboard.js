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

    var data = {"OkPercent": 86.58536585365853, "KoPercent": 13.414634146341463};
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 82, 11, 13.414634146341463, 153.8414634146341, 72, 448, 137.5, 244.80000000000007, 308.9499999999998, 448.0, 16.321656050955415, 458.37052460688693, 21.653679525776273], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 2, 2, 100.0, 94.0, 87, 101, 94.0, 101.0, 101.0, 101.0, 11.904761904761903, 10.044642857142856, 19.327799479166664], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 2, 1, 50.0, 92.0, 72, 112, 92.0, 112.0, 112.0, 112.0, 12.578616352201259, 21.459807389937108, 18.97233687106918], "isController": false}, {"data": ["3. POST /admin/api/v1/city/query", 2, 0, 0.0, 191.5, 191, 192, 191.5, 192.0, 192.0, 192.0, 3.7105751391465676, 123.30052759740259, 5.694500811688311], "isController": false}, {"data": ["6. POST /admin/api/v1/show/query", 2, 0, 0.0, 192.5, 157, 228, 192.5, 228.0, 228.0, 228.0, 3.4129692832764507, 4.814486454778157, 5.464417128839591], "isController": false}, {"data": ["16. POST /admin/api/v1/order/query", 2, 0, 0.0, 178.0, 131, 225, 178.0, 225.0, 225.0, 225.0, 6.825938566552901, 211.90073058873722, 11.688753199658704], "isController": false}, {"data": ["1. POST /admin/api/v1/country/query", 2, 0, 0.0, 271.0, 224, 318, 271.0, 318.0, 318.0, 318.0, 2.945508100147275, 11.445485088365242, 4.408194495581737], "isController": false}, {"data": ["36. POST /widget/api/v1/event/{eventId}/root-tickets", 2, 0, 0.0, 169.0, 168, 170, 169.0, 170.0, 170.0, 170.0, 5.167958656330749, 6.919210271317829, 2.9019299095607236], "isController": false}, {"data": ["20. POST /admin/api/v1/legalentity/query", 2, 0, 0.0, 183.0, 114, 252, 183.0, 252.0, 252.0, 252.0, 7.936507936507936, 1420.6620473710318, 12.435670882936508], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 2, 0, 0.0, 121.0, 101, 141, 121.0, 141.0, 141.0, 141.0, 5.361930294906166, 118.55940013404826, 8.385870475871315], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 2, 0, 0.0, 299.5, 263, 336, 299.5, 336.0, 336.0, 336.0, 3.327787021630616, 743.5426632695508, 6.965929180532446], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 2, 0, 0.0, 74.5, 73, 76, 74.5, 76.0, 76.0, 76.0, 7.547169811320755, 2.542747641509434, 3.7367334905660377], "isController": false}, {"data": ["26. POST /admin/api/v1/template-group/query", 2, 0, 0.0, 158.5, 145, 172, 158.5, 172.0, 172.0, 172.0, 10.362694300518134, 105.80776392487046, 16.28784812176166], "isController": false}, {"data": ["28. POST /admin/api/v1/pushkaGateway/query", 2, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 13.071895424836601, 7.206137663398693, 19.639756944444446], "isController": false}, {"data": ["23. POST /admin/api/v1/invitation/query", 2, 0, 0.0, 126.5, 107, 146, 126.5, 146.0, 146.0, 146.0, 13.333333333333334, 436.1197916666667, 20.95703125], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 2, 2, 100.0, 91.0, 90, 92, 91.0, 92.0, 92.0, 92.0, 14.388489208633095, 12.140287769784171, 23.037039118705035], "isController": false}, {"data": ["37. POST /widget/api/v1/cart", 2, 0, 0.0, 122.5, 110, 135, 122.5, 135.0, 135.0, 135.0, 6.116207951070336, 3.004348241590214, 2.962538226299694], "isController": false}, {"data": ["25. POST /admin/api/v1/paypoint/query", 2, 0, 0.0, 163.5, 130, 197, 163.5, 197.0, 197.0, 197.0, 10.15228426395939, 351.39891338832484, 15.877815672588833], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 2, 2, 100.0, 231.5, 150, 313, 231.5, 313.0, 313.0, 313.0, 6.3897763578274756, 92.54879692492013, 3.9499301118210863], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 2, 0, 0.0, 120.5, 118, 123, 120.5, 123.0, 123.0, 123.0, 5.128205128205129, 68.90775240384615, 7.905148237179487], "isController": false}, {"data": ["9. POST /admin/api/v1/tariff/query", 2, 0, 0.0, 122.5, 105, 140, 122.5, 140.0, 140.0, 140.0, 3.9603960396039604, 93.3613087871287, 5.923189975247524], "isController": false}, {"data": ["19. POST /admin/api/v1/customer/query", 2, 0, 0.0, 105.5, 105, 106, 105.5, 106.0, 106.0, 106.0, 10.362694300518134, 383.6119656735751, 16.65216159326425], "isController": false}, {"data": ["22. POST /admin/api/v1/user/query", 2, 0, 0.0, 99.0, 87, 111, 99.0, 111.0, 111.0, 111.0, 15.267175572519083, 218.8692748091603, 23.549320133587784], "isController": false}, {"data": ["8. POST /admin/api/v1/age-raiting/query", 2, 0, 0.0, 119.5, 112, 127, 119.5, 127.0, 127.0, 127.0, 3.780718336483932, 113.53231332703213, 5.850144730623819], "isController": false}, {"data": ["24. POST /admin/api/v1/gateway/query", 2, 0, 0.0, 171.5, 147, 196, 171.5, 196.0, 196.0, 196.0, 10.204081632653061, 222.7509167729592, 15.271245216836734], "isController": false}, {"data": ["4. POST /admin/api/v1/venue/query", 2, 0, 0.0, 206.0, 197, 215, 206.0, 215.0, 215.0, 215.0, 3.5460992907801416, 295.63178745567376, 5.4351590203900715], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 2, 2, 100.0, 96.0, 92, 100, 96.0, 100.0, 100.0, 100.0, 7.633587786259541, 6.463203721374046, 11.603202528625953], "isController": false}, {"data": ["21. POST /admin/api/v1/contract/query", 2, 0, 0.0, 193.5, 178, 209, 193.5, 209.0, 209.0, 209.0, 8.81057268722467, 279.3484994493392, 13.60734443832599], "isController": false}, {"data": ["5. POST /admin/api/v1/hall/query", 2, 0, 0.0, 167.5, 163, 172, 167.5, 172.0, 172.0, 172.0, 3.780718336483932, 153.55106923440454, 5.898142131379962], "isController": false}, {"data": ["30. POST /admin/api/v1/sender-settings/query", 2, 0, 0.0, 131.5, 111, 152, 131.5, 152.0, 152.0, 152.0, 8.368200836820083, 228.4093880753138, 12.98133498953975], "isController": false}, {"data": ["32. GET /widget/api/v1/show/{showId}", 2, 0, 0.0, 337.0, 226, 448, 337.0, 448.0, 448.0, 448.0, 2.923976608187134, 2.9139825475146197, 1.4220120614035086], "isController": false}, {"data": ["33. POST /widget/api/v1/event/tabs/query", 2, 0, 0.0, 125.0, 115, 135, 125.0, 135.0, 135.0, 135.0, 5.698005698005698, 3.35536858974359, 3.0604522792022792], "isController": false}, {"data": ["34. POST /widget/api/v1/event/tabs/events/query", 2, 0, 0.0, 127.0, 122, 132, 127.0, 132.0, 132.0, 132.0, 5.934718100890208, 6.091199925816023, 3.5932863501483676], "isController": false}, {"data": ["7. POST /admin/api/v1/event/query", 2, 0, 0.0, 279.5, 273, 286, 279.5, 286.0, 286.0, 286.0, 2.8449502133712663, 371.3451835881935, 4.368832236842105], "isController": false}, {"data": ["2. POST /admin/api/v1/state/query", 2, 0, 0.0, 162.5, 156, 169, 162.5, 169.0, 169.0, 169.0, 3.8684719535783367, 62.8362246131528, 5.940597799806576], "isController": false}, {"data": ["41. POST /widget/api/v1/order", 2, 2, 100.0, 114.5, 88, 141, 114.5, 141.0, 141.0, 141.0, 11.834319526627219, 337.0007396449704, 9.28023298816568], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 2, 0, 0.0, 131.5, 118, 145, 131.5, 145.0, 145.0, 145.0, 4.140786749482402, 21.937273550724637, 7.042168090062112], "isController": false}, {"data": ["35. GET /widget/api/v1/event/{eventId}", 2, 0, 0.0, 155.0, 148, 162, 155.0, 162.0, 162.0, 162.0, 5.449591280653951, 9.156271287465941, 2.6556113760217985], "isController": false}, {"data": ["39. GET /widget/api/v1/cart/{cartId}", 2, 0, 0.0, 123.5, 98, 149, 123.5, 149.0, 149.0, 149.0, 7.017543859649123, 5.359100877192983, 3.4128289473684212], "isController": false}, {"data": ["31. POST /admin/api/v1/progressbar/query", 2, 0, 0.0, 102.5, 88, 117, 102.5, 117.0, 117.0, 117.0, 9.30232558139535, 267.93695494186045, 13.958030523255815], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 2, 0, 0.0, 142.5, 112, 173, 142.5, 173.0, 173.0, 173.0, 5.830903790087463, 106.86383928571428, 9.159188228862973], "isController": false}, {"data": ["18. POST /admin/api/v1/cart/query", 2, 0, 0.0, 108.5, 105, 112, 108.5, 112.0, 112.0, 112.0, 10.416666666666666, 24.943033854166668, 16.1895751953125], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 9, 81.81818181818181, 10.975609756097562], "isController": false}, {"data": ["422/Unprocessable Entity", 1, 9.090909090909092, 1.2195121951219512], "isController": false}, {"data": ["403/Forbidden", 1, 9.090909090909092, 1.2195121951219512], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 82, 11, "500/Internal Server Error", 9, "422/Unprocessable Entity", 1, "403/Forbidden", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 2, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 2, 1, "403/Forbidden", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 2, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 2, 2, "500/Internal Server Error", 1, "422/Unprocessable Entity", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 2, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["41. POST /widget/api/v1/order", 2, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
