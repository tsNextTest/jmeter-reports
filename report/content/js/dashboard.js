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

    var data = {"OkPercent": 17.073170731707318, "KoPercent": 82.92682926829268};
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

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.13414634146341464, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "17. POST /admin/api/v1/payment/query"], "isController": false}, {"data": [0.0, 500, 1500, "29. POST /admin/api/v1/notification/system/query"], "isController": false}, {"data": [0.0, 500, 1500, "3. POST /admin/api/v1/city/query"], "isController": false}, {"data": [0.0, 500, 1500, "6. POST /admin/api/v1/show/query"], "isController": false}, {"data": [0.0, 500, 1500, "16. POST /admin/api/v1/order/query"], "isController": false}, {"data": [0.0, 500, 1500, "1. POST /admin/api/v1/country/query"], "isController": false}, {"data": [0.5, 500, 1500, "36. POST /widget/api/v1/event/{eventId}/root-tickets"], "isController": false}, {"data": [0.0, 500, 1500, "20. POST /admin/api/v1/legalentity/query"], "isController": false}, {"data": [0.0, 500, 1500, "13. POST /admin/api/v1/discount/query"], "isController": false}, {"data": [0.0, 500, 1500, "11. POST /admin/api/v1/ticket/query"], "isController": false}, {"data": [0.0, 500, 1500, "38. GET /widget/api/v1/event/{eventId}/tickets"], "isController": false}, {"data": [0.0, 500, 1500, "26. POST /admin/api/v1/template-group/query"], "isController": false}, {"data": [0.0, 500, 1500, "28. POST /admin/api/v1/pushkaGateway/query"], "isController": false}, {"data": [0.0, 500, 1500, "23. POST /admin/api/v1/invitation/query"], "isController": false}, {"data": [0.0, 500, 1500, "27. POST /admin/api/v1/terminal/query"], "isController": false}, {"data": [1.0, 500, 1500, "37. POST /widget/api/v1/cart"], "isController": false}, {"data": [0.0, 500, 1500, "25. POST /admin/api/v1/paypoint/query"], "isController": false}, {"data": [0.0, 500, 1500, "12. POST /admin/api/v1/quota/query"], "isController": false}, {"data": [0.0, 500, 1500, "9. POST /admin/api/v1/tariff/query"], "isController": false}, {"data": [0.0, 500, 1500, "19. POST /admin/api/v1/customer/query"], "isController": false}, {"data": [0.0, 500, 1500, "22. POST /admin/api/v1/user/query"], "isController": false}, {"data": [0.0, 500, 1500, "8. POST /admin/api/v1/age-raiting/query"], "isController": false}, {"data": [0.0, 500, 1500, "24. POST /admin/api/v1/gateway/query"], "isController": false}, {"data": [0.0, 500, 1500, "4. POST /admin/api/v1/venue/query"], "isController": false}, {"data": [0.0, 500, 1500, "15. POST /admin/api/v1/service-fee/query"], "isController": false}, {"data": [0.0, 500, 1500, "21. POST /admin/api/v1/contract/query"], "isController": false}, {"data": [0.0, 500, 1500, "41. POST /widget/api/v1/cart/{cartId}/ticket"], "isController": false}, {"data": [0.0, 500, 1500, "5. POST /admin/api/v1/hall/query"], "isController": false}, {"data": [0.0, 500, 1500, "30. POST /admin/api/v1/sender-settings/query"], "isController": false}, {"data": [0.5, 500, 1500, "32. GET /widget/api/v1/show/{showId}"], "isController": false}, {"data": [1.0, 500, 1500, "33. POST /widget/api/v1/event/tabs/query"], "isController": false}, {"data": [0.0, 500, 1500, "7. POST /admin/api/v1/event/query"], "isController": false}, {"data": [1.0, 500, 1500, "34. POST /widget/api/v1/event/tabs/events/query"], "isController": false}, {"data": [0.0, 500, 1500, "2. POST /admin/api/v1/state/query"], "isController": false}, {"data": [0.0, 500, 1500, "10. POST /admin/api/v1/root-ticket/query"], "isController": false}, {"data": [1.0, 500, 1500, "35. GET /widget/api/v1/event/{eventId}"], "isController": false}, {"data": [0.5, 500, 1500, "39. GET /widget/api/v1/cart/{cartId}"], "isController": false}, {"data": [0.0, 500, 1500, "31. POST /admin/api/v1/progressbar/query"], "isController": false}, {"data": [0.0, 500, 1500, "42. POST /widget/api/v1/order"], "isController": false}, {"data": [0.0, 500, 1500, "14. POST /admin/api/v1/dealer-discount/query"], "isController": false}, {"data": [0.0, 500, 1500, "18. POST /admin/api/v1/cart/query"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 41, 34, 82.92682926829268, 1647.487804878049, 60, 60106, 102.0, 691.4000000000004, 907.9999999999999, 60106.0, 0.6406650415650978, 0.4743033255984749, 0.323460768055816], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 1, 1, 100.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 6.5234375, 5.380859375], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 1, 1, 100.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 10.216346153846153, 6.505408653846153], "isController": false}, {"data": ["3. POST /admin/api/v1/city/query", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 6.429842202970296, 4.447710396039604], "isController": false}, {"data": ["6. POST /admin/api/v1/show/query", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 6.429842202970296, 5.10519801980198], "isController": false}, {"data": ["16. POST /admin/api/v1/order/query", 1, 1, 100.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 6.3144720873786415, 6.390321601941748], "isController": false}, {"data": ["1. POST /admin/api/v1/country/query", 1, 1, 100.0, 827.0, 827, 827, 827.0, 827.0, 827.0, 827.0, 1.2091898428053203, 0.7888074365175333, 0.4971376209189843], "isController": false}, {"data": ["36. POST /widget/api/v1/event/{eventId}/root-tickets", 1, 0, 0.0, 713.0, 713, 713, 713.0, 713.0, 713.0, 713.0, 1.402524544179523, 0.7957683204768584, 0.7834414446002805], "isController": false}, {"data": ["20. POST /admin/api/v1/legalentity/query", 1, 1, 100.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 10.25390625, 7.5225830078125], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 6.405101102941177, 4.691329656862745], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 6.385952818627452, 9.880514705882353], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 1, 1, 100.0, 60106.0, 60106, 60106, 60106.0, 60106.0, 60106.0, 60106.0, 0.016637274149003428, 0.012169256189065983, 0.008188658370212624], "isController": false}, {"data": ["26. POST /admin/api/v1/template-group/query", 1, 1, 100.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 9.838502798507463, 7.258628731343284], "isController": false}, {"data": ["28. POST /admin/api/v1/pushkaGateway/query", 1, 1, 100.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 10.790215163934427, 6.8359375], "isController": false}, {"data": ["23. POST /admin/api/v1/invitation/query", 1, 1, 100.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 10.101318359375, 7.598876953125], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 1, 1, 100.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 10.888671875, 8.59375], "isController": false}, {"data": ["37. POST /widget/api/v1/cart", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 2.237215909090909, 2.188387784090909], "isController": false}, {"data": ["25. POST /admin/api/v1/paypoint/query", 1, 1, 100.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 10.37016369047619, 7.595486111111111], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 1, 1, 100.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 6.50390625, 4.560546875], "isController": false}, {"data": ["9. POST /admin/api/v1/tariff/query", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 6.449180074257425, 4.06095297029703], "isController": false}, {"data": ["19. POST /admin/api/v1/customer/query", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 6.405101102941177, 5.1125919117647065], "isController": false}, {"data": ["22. POST /admin/api/v1/user/query", 1, 1, 100.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 6.2101790048543695, 4.437196601941748], "isController": false}, {"data": ["8. POST /admin/api/v1/age-raiting/query", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 6.433823529411765, 4.528569240196079], "isController": false}, {"data": ["24. POST /admin/api/v1/gateway/query", 1, 1, 100.0, 138.0, 138, 138, 138.0, 138.0, 138.0, 138.0, 7.246376811594203, 4.727128623188405, 2.979223278985507], "isController": false}, {"data": ["4. POST /admin/api/v1/venue/query", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 6.376378676470589, 4.384957107843138], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 1, 1, 100.0, 131.0, 131, 131, 131.0, 131.0, 131.0, 131.0, 7.633587786259541, 5.009541984732825, 3.3173306297709924], "isController": false}, {"data": ["21. POST /admin/api/v1/contract/query", 1, 1, 100.0, 139.0, 139, 139, 139.0, 139.0, 139.0, 139.0, 7.194244604316547, 4.700146133093525, 3.302045863309352], "isController": false}, {"data": ["41. POST /widget/api/v1/cart/{cartId}/ticket", 1, 1, 100.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 9.594963592233011, 5.518052184466019], "isController": false}, {"data": ["5. POST /admin/api/v1/hall/query", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 6.366804534313726, 4.653033088235294], "isController": false}, {"data": ["30. POST /admin/api/v1/sender-settings/query", 1, 1, 100.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 10.647681451612904, 7.513230846774194], "isController": false}, {"data": ["32. GET /widget/api/v1/show/{showId}", 1, 0, 0.0, 917.0, 917, 917, 917.0, 917.0, 917.0, 917.0, 1.0905125408942202, 0.6996745501635768, 0.527152058342421], "isController": false}, {"data": ["33. POST /widget/api/v1/event/tabs/query", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 1.7368179967426711, 1.7399989820846906], "isController": false}, {"data": ["7. POST /admin/api/v1/event/query", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 6.376378676470589, 4.413679534313726], "isController": false}, {"data": ["34. POST /widget/api/v1/event/tabs/events/query", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 5.295697380514706, 2.2152171415441173], "isController": false}, {"data": ["2. POST /admin/api/v1/state/query", 1, 1, 100.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 7.475754310344828, 5.174658764367816], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 6.433823529411765, 6.03170955882353], "isController": false}, {"data": ["35. GET /widget/api/v1/event/{eventId}", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 15.331083131067961, 2.3513349514563107], "isController": false}, {"data": ["39. GET /widget/api/v1/cart/{cartId}", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 1.2251420454545454, 0.7990056818181819], "isController": false}, {"data": ["31. POST /admin/api/v1/progressbar/query", 1, 1, 100.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 9.9609375, 6.385216346153846], "isController": false}, {"data": ["42. POST /widget/api/v1/order", 1, 1, 100.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 1.6205554872047243, 1.5378937007874016], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 1, 1, 100.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 9.297975352112676, 6.835937500000001], "isController": false}, {"data": ["18. POST /admin/api/v1/cart/query", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 6.429842202970296, 4.641089108910891], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 1, 2.9411764705882355, 2.4390243902439024], "isController": false}, {"data": ["504/Gateway Time-out", 1, 2.9411764705882355, 2.4390243902439024], "isController": false}, {"data": ["422/Unprocessable Entity", 1, 2.9411764705882355, 2.4390243902439024], "isController": false}, {"data": ["401/Unauthorized", 31, 91.17647058823529, 75.60975609756098], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 41, 34, "401/Unauthorized", 31, "400/Bad Request", 1, "504/Gateway Time-out", 1, "422/Unprocessable Entity", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["3. POST /admin/api/v1/city/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["6. POST /admin/api/v1/show/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["16. POST /admin/api/v1/order/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["1. POST /admin/api/v1/country/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["20. POST /admin/api/v1/legalentity/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 1, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["26. POST /admin/api/v1/template-group/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["28. POST /admin/api/v1/pushkaGateway/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["23. POST /admin/api/v1/invitation/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["25. POST /admin/api/v1/paypoint/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["9. POST /admin/api/v1/tariff/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["19. POST /admin/api/v1/customer/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["22. POST /admin/api/v1/user/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["8. POST /admin/api/v1/age-raiting/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["24. POST /admin/api/v1/gateway/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["4. POST /admin/api/v1/venue/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["21. POST /admin/api/v1/contract/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["41. POST /widget/api/v1/cart/{cartId}/ticket", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["5. POST /admin/api/v1/hall/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["30. POST /admin/api/v1/sender-settings/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["7. POST /admin/api/v1/event/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["2. POST /admin/api/v1/state/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["31. POST /admin/api/v1/progressbar/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["42. POST /widget/api/v1/order", 1, 1, "422/Unprocessable Entity", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["18. POST /admin/api/v1/cart/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
