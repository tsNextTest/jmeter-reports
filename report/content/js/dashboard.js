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

    var data = {"OkPercent": 19.51219512195122, "KoPercent": 80.48780487804878};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.14634146341463414, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "17. POST /admin/api/v1/payment/query"], "isController": false}, {"data": [0.0, 500, 1500, "29. POST /admin/api/v1/notification/system/query"], "isController": false}, {"data": [0.0, 500, 1500, "3. POST /admin/api/v1/city/query"], "isController": false}, {"data": [0.0, 500, 1500, "6. POST /admin/api/v1/show/query"], "isController": false}, {"data": [0.0, 500, 1500, "16. POST /admin/api/v1/order/query"], "isController": false}, {"data": [0.0, 500, 1500, "1. POST /admin/api/v1/country/query"], "isController": false}, {"data": [0.5, 500, 1500, "36. POST /widget/api/v1/event/{eventId}/root-tickets"], "isController": false}, {"data": [0.0, 500, 1500, "20. POST /admin/api/v1/legalentity/query"], "isController": false}, {"data": [0.0, 500, 1500, "13. POST /admin/api/v1/discount/query"], "isController": false}, {"data": [0.0, 500, 1500, "11. POST /admin/api/v1/ticket/query"], "isController": false}, {"data": [0.0, 500, 1500, "38. GET /widget/api/v1/event/{eventId}/tickets"], "isController": false}, {"data": [0.0, 500, 1500, "26. POST /admin/api/v1/template-group/query"], "isController": false}, {"data": [0.0, 500, 1500, "28. POST /admin/api/v1/pushkaGateway/query"], "isController": false}, {"data": [0.0, 500, 1500, "23. POST /admin/api/v1/invitation/query"], "isController": false}, {"data": [0.0, 500, 1500, "27. POST /admin/api/v1/terminal/query"], "isController": false}, {"data": [1.0, 500, 1500, "37. POST /widget/api/v1/cart"], "isController": false}, {"data": [0.0, 500, 1500, "25. POST /admin/api/v1/paypoint/query"], "isController": false}, {"data": [0.0, 500, 1500, "12. POST /admin/api/v1/quota/query"], "isController": false}, {"data": [0.0, 500, 1500, "9. POST /admin/api/v1/tariff/query"], "isController": false}, {"data": [0.0, 500, 1500, "19. POST /admin/api/v1/customer/query"], "isController": false}, {"data": [0.0, 500, 1500, "22. POST /admin/api/v1/user/query"], "isController": false}, {"data": [0.0, 500, 1500, "8. POST /admin/api/v1/age-raiting/query"], "isController": false}, {"data": [0.0, 500, 1500, "24. POST /admin/api/v1/gateway/query"], "isController": false}, {"data": [0.0, 500, 1500, "4. POST /admin/api/v1/venue/query"], "isController": false}, {"data": [0.0, 500, 1500, "15. POST /admin/api/v1/service-fee/query"], "isController": false}, {"data": [0.0, 500, 1500, "21. POST /admin/api/v1/contract/query"], "isController": false}, {"data": [0.0, 500, 1500, "41. POST /widget/api/v1/cart/{cartId}/ticket"], "isController": false}, {"data": [0.0, 500, 1500, "5. POST /admin/api/v1/hall/query"], "isController": false}, {"data": [0.0, 500, 1500, "30. POST /admin/api/v1/sender-settings/query"], "isController": false}, {"data": [0.5, 500, 1500, "32. GET /widget/api/v1/show/{showId}"], "isController": false}, {"data": [1.0, 500, 1500, "33. POST /widget/api/v1/event/tabs/query"], "isController": false}, {"data": [1.0, 500, 1500, "34. POST /widget/api/v1/event/tabs/events/query"], "isController": false}, {"data": [0.0, 500, 1500, "7. POST /admin/api/v1/event/query"], "isController": false}, {"data": [0.0, 500, 1500, "2. POST /admin/api/v1/state/query"], "isController": false}, {"data": [0.0, 500, 1500, "10. POST /admin/api/v1/root-ticket/query"], "isController": false}, {"data": [1.0, 500, 1500, "35. GET /widget/api/v1/event/{eventId}"], "isController": false}, {"data": [1.0, 500, 1500, "39. GET /widget/api/v1/cart/{cartId}"], "isController": false}, {"data": [0.0, 500, 1500, "31. POST /admin/api/v1/progressbar/query"], "isController": false}, {"data": [0.0, 500, 1500, "42. POST /widget/api/v1/order"], "isController": false}, {"data": [0.0, 500, 1500, "14. POST /admin/api/v1/dealer-discount/query"], "isController": false}, {"data": [0.0, 500, 1500, "18. POST /admin/api/v1/cart/query"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 41, 33, 80.48780487804878, 215.43902439024396, 63, 1850, 101.0, 515.2000000000006, 905.5999999999999, 1850.0, 7.639277063536426, 472.3642092300168, 10.190130368455376], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 1, 1, 100.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 7.36328125, 16.337890625], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 1, 1, 100.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 11.873759920634921, 24.104042658730158], "isController": false}, {"data": ["3. POST /admin/api/v1/city/query", 1, 1, 100.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 8.836125753012048, 18.61351656626506], "isController": false}, {"data": ["6. POST /admin/api/v1/show/query", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 7.190180759803922, 15.79733455882353], "isController": false}, {"data": ["16. POST /admin/api/v1/order/query", 1, 1, 100.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 7.0612980769230775, 16.864483173076923], "isController": false}, {"data": ["1. POST /admin/api/v1/country/query", 1, 1, 100.0, 875.0, 875, 875, 875.0, 875.0, 875.0, 875.0, 1.142857142857143, 0.8415178571428571, 1.7220982142857142], "isController": false}, {"data": ["36. POST /widget/api/v1/event/{eventId}/root-tickets", 1, 0, 0.0, 542.0, 542, 542, 542.0, 542.0, 542.0, 542.0, 1.8450184501845017, 1.0468317573800738, 1.030615774907749], "isController": false}, {"data": ["20. POST /admin/api/v1/legalentity/query", 1, 1, 100.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 11.388221153846153, 24.263822115384613], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 7.228477328431373, 15.433517156862747], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 1, 1, 100.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 7.353515625, 21.03515625], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 1, 0, 0.0, 1850.0, 1850, 1850, 1850.0, 1850.0, 1850.0, 1850.0, 0.5405405405405406, 1352.9497466216214, 0.26604729729729726], "isController": false}, {"data": ["26. POST /admin/api/v1/template-group/query", 1, 1, 100.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 10.321723090277779, 21.97265625], "isController": false}, {"data": ["28. POST /admin/api/v1/pushkaGateway/query", 1, 1, 100.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 11.24526515151515, 22.919625946969695], "isController": false}, {"data": ["23. POST /admin/api/v1/invitation/query", 1, 1, 100.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 10.902518656716417, 23.612406716417908], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 1, 1, 100.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 10.100064212328768, 22.07298801369863], "isController": false}, {"data": ["37. POST /widget/api/v1/cart", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 2.4560546875, 2.4072265625], "isController": false}, {"data": ["25. POST /admin/api/v1/paypoint/query", 1, 1, 100.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 10.532924107142856, 22.488839285714285], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 1, 1, 100.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 7.34375, 15.517578125], "isController": false}, {"data": ["9. POST /admin/api/v1/tariff/query", 1, 1, 100.0, 126.0, 126, 126, 126.0, 126.0, 126.0, 126.0, 7.936507936507936, 5.836123511904762, 11.951264880952381], "isController": false}, {"data": ["19. POST /admin/api/v1/customer/query", 1, 1, 100.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 9.102527006172838, 19.96527777777778], "isController": false}, {"data": ["22. POST /admin/api/v1/user/query", 1, 1, 100.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 8.933738425925926, 19.169560185185183], "isController": false}, {"data": ["8. POST /admin/api/v1/age-raiting/query", 1, 1, 100.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 9.613433441558442, 20.228794642857142], "isController": false}, {"data": ["24. POST /admin/api/v1/gateway/query", 1, 1, 100.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 10.671422101449274, 21.83820199275362], "isController": false}, {"data": ["4. POST /admin/api/v1/venue/query", 1, 1, 100.0, 114.0, 114, 114, 114.0, 114.0, 114.0, 114.0, 8.771929824561402, 6.441885964912281, 13.534813596491228], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 7.329053217821782, 15.151222153465346], "isController": false}, {"data": ["21. POST /admin/api/v1/contract/query", 1, 1, 100.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 10.240342881944445, 21.592881944444446], "isController": false}, {"data": ["41. POST /widget/api/v1/cart/{cartId}/ticket", 1, 1, 100.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 2.425810042997543, 1.454046375921376], "isController": false}, {"data": ["5. POST /admin/api/v1/hall/query", 1, 1, 100.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 7.333984375, 15.703125], "isController": false}, {"data": ["30. POST /admin/api/v1/sender-settings/query", 1, 1, 100.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 8.858816964285714, 18.589564732142858], "isController": false}, {"data": ["32. GET /widget/api/v1/show/{showId}", 1, 0, 0.0, 909.0, 909, 909, 909.0, 909.0, 909.0, 909.0, 1.1001100110011, 0.705832301980198, 0.5317914603960396], "isController": false}, {"data": ["33. POST /widget/api/v1/event/tabs/query", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 3.3203125, 3.338623046875], "isController": false}, {"data": ["34. POST /widget/api/v1/event/tabs/events/query", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 6.129488031914894, 2.563996010638298], "isController": false}, {"data": ["7. POST /admin/api/v1/event/query", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 7.199754901960785, 15.155867034313726], "isController": false}, {"data": ["2. POST /admin/api/v1/state/query", 1, 1, 100.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 3.8248697916666665, 8.051554361979166], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 7.329053217821782, 16.939975247524753], "isController": false}, {"data": ["35. GET /widget/api/v1/event/{eventId}", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 11.611040900735293, 1.7807904411764706], "isController": false}, {"data": ["39. GET /widget/api/v1/cart/{cartId}", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 3.508219786729858, 2.290987855450237], "isController": false}, {"data": ["31. POST /admin/api/v1/progressbar/query", 1, 1, 100.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 8.048592032967033, 16.6015625], "isController": false}, {"data": ["42. POST /widget/api/v1/order", 1, 1, 100.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 2.017750459558824, 1.9148284313725492], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 7.367728960396039, 15.654006806930692], "isController": false}, {"data": ["18. POST /admin/api/v1/cart/query", 1, 1, 100.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 6.984747023809524, 14.899553571428571], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["422/Unprocessable Entity", 2, 6.0606060606060606, 4.878048780487805], "isController": false}, {"data": ["401/Unauthorized", 31, 93.93939393939394, 75.60975609756098], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 41, 33, "401/Unauthorized", 31, "422/Unprocessable Entity", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["3. POST /admin/api/v1/city/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["6. POST /admin/api/v1/show/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["16. POST /admin/api/v1/order/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["1. POST /admin/api/v1/country/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["20. POST /admin/api/v1/legalentity/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["26. POST /admin/api/v1/template-group/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["28. POST /admin/api/v1/pushkaGateway/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["23. POST /admin/api/v1/invitation/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["25. POST /admin/api/v1/paypoint/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["9. POST /admin/api/v1/tariff/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["19. POST /admin/api/v1/customer/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["22. POST /admin/api/v1/user/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["8. POST /admin/api/v1/age-raiting/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["24. POST /admin/api/v1/gateway/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["4. POST /admin/api/v1/venue/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["21. POST /admin/api/v1/contract/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["41. POST /widget/api/v1/cart/{cartId}/ticket", 1, 1, "422/Unprocessable Entity", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["5. POST /admin/api/v1/hall/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["30. POST /admin/api/v1/sender-settings/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["7. POST /admin/api/v1/event/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["2. POST /admin/api/v1/state/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["31. POST /admin/api/v1/progressbar/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["42. POST /widget/api/v1/order", 1, 1, "422/Unprocessable Entity", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["18. POST /admin/api/v1/cart/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
