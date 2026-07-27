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

    var data = {"OkPercent": 19.047619047619047, "KoPercent": 80.95238095238095};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.10714285714285714, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "17. POST /admin/api/v1/payment/query"], "isController": false}, {"data": [0.0, 500, 1500, "29. POST /admin/api/v1/notification/system/query"], "isController": false}, {"data": [0.0, 500, 1500, "3. POST /admin/api/v1/city/query"], "isController": false}, {"data": [0.0, 500, 1500, "6. POST /admin/api/v1/show/query"], "isController": false}, {"data": [0.0, 500, 1500, "16. POST /admin/api/v1/order/query"], "isController": false}, {"data": [0.0, 500, 1500, "1. POST /admin/api/v1/country/query"], "isController": false}, {"data": [0.0, 500, 1500, "20. POST /admin/api/v1/legalentity/query"], "isController": false}, {"data": [0.5, 500, 1500, "36. POST /widget/api/v1/event/{eventId}/root-tickets"], "isController": false}, {"data": [0.0, 500, 1500, "13. POST /admin/api/v1/discount/query"], "isController": false}, {"data": [0.0, 500, 1500, "11. POST /admin/api/v1/ticket/query"], "isController": false}, {"data": [0.0, 500, 1500, "38. GET /widget/api/v1/event/{eventId}/tickets"], "isController": false}, {"data": [0.0, 500, 1500, "26. POST /admin/api/v1/template-group/query"], "isController": false}, {"data": [0.0, 500, 1500, "28. POST /admin/api/v1/pushkaGateway/query"], "isController": false}, {"data": [0.0, 500, 1500, "23. POST /admin/api/v1/invitation/query"], "isController": false}, {"data": [0.0, 500, 1500, "27. POST /admin/api/v1/terminal/query"], "isController": false}, {"data": [1.0, 500, 1500, "37. POST /widget/api/v1/cart"], "isController": false}, {"data": [0.0, 500, 1500, "25. POST /admin/api/v1/paypoint/query"], "isController": false}, {"data": [0.0, 500, 1500, "12. POST /admin/api/v1/quota/query"], "isController": false}, {"data": [0.0, 500, 1500, "9. POST /admin/api/v1/tariff/query"], "isController": false}, {"data": [0.0, 500, 1500, "19. POST /admin/api/v1/customer/query"], "isController": false}, {"data": [0.0, 500, 1500, "22. POST /admin/api/v1/user/query"], "isController": false}, {"data": [0.0, 500, 1500, "8. POST /admin/api/v1/age-raiting/query"], "isController": false}, {"data": [0.0, 500, 1500, "24. POST /admin/api/v1/gateway/query"], "isController": false}, {"data": [0.0, 500, 1500, "4. POST /admin/api/v1/venue/query"], "isController": false}, {"data": [0.0, 500, 1500, "15. POST /admin/api/v1/service-fee/query"], "isController": false}, {"data": [0.0, 500, 1500, "21. POST /admin/api/v1/contract/query"], "isController": false}, {"data": [0.0, 500, 1500, "41. POST /widget/api/v1/cart/{cartId}/ticket"], "isController": false}, {"data": [0.0, 500, 1500, "5. POST /admin/api/v1/hall/query"], "isController": false}, {"data": [0.0, 500, 1500, "30. POST /admin/api/v1/sender-settings/query"], "isController": false}, {"data": [0.0, 500, 1500, "32. GET /widget/api/v1/show/{showId}"], "isController": false}, {"data": [1.0, 500, 1500, "33. POST /widget/api/v1/event/tabs/query"], "isController": false}, {"data": [0.0, 500, 1500, "7. POST /admin/api/v1/event/query"], "isController": false}, {"data": [0.5, 500, 1500, "34. POST /widget/api/v1/event/tabs/events/query"], "isController": false}, {"data": [0.0, 500, 1500, "2. POST /admin/api/v1/state/query"], "isController": false}, {"data": [0.0, 500, 1500, "10. POST /admin/api/v1/root-ticket/query"], "isController": false}, {"data": [0.0, 500, 1500, "35. GET /widget/api/v1/event/{eventId}"], "isController": false}, {"data": [0.5, 500, 1500, "39. GET /widget/api/v1/cart/{cartId}"], "isController": false}, {"data": [0.0, 500, 1500, "31. POST /admin/api/v1/progressbar/query"], "isController": false}, {"data": [0.0, 500, 1500, "42. POST /widget/api/v1/order"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.0, 500, 1500, "14. POST /admin/api/v1/dealer-discount/query"], "isController": false}, {"data": [0.0, 500, 1500, "18. POST /admin/api/v1/cart/query"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 42, 34, 80.95238095238095, 1677.2142857142856, 2, 60115, 68.0, 1097.400000000001, 1854.15, 60115.0, 0.6149521215848195, 0.4906691081730065, 0.3030864053486193], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 1, 1, 100.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 9.060329861111112, 7.473415798611112], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 1, 1, 100.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 9.62409420289855, 6.128283514492753], "isController": false}, {"data": ["3. POST /admin/api/v1/city/query", 1, 1, 100.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 9.692747201492537, 6.704757462686567], "isController": false}, {"data": ["6. POST /admin/api/v1/show/query", 1, 1, 100.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 9.990985576923077, 7.9326923076923075], "isController": false}, {"data": ["16. POST /admin/api/v1/order/query", 1, 1, 100.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 10.006009615384615, 10.126201923076923], "isController": false}, {"data": ["1. POST /admin/api/v1/country/query", 1, 1, 100.0, 332.0, 332, 332, 332.0, 332.0, 332.0, 332.0, 3.0120481927710845, 1.9648908132530118, 1.238351844879518], "isController": false}, {"data": ["20. POST /admin/api/v1/legalentity/query", 1, 1, 100.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 10.096153846153845, 7.406850961538462], "isController": false}, {"data": ["36. POST /widget/api/v1/event/{eventId}/root-tickets", 1, 0, 0.0, 720.0, 720, 720, 720.0, 720.0, 720.0, 720.0, 1.3888888888888888, 0.8192274305555556, 0.7758246527777778], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 1, 1, 100.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 9.751049440298507, 7.142024253731343], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 1, 1, 100.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 9.305245535714285, 14.397321428571427], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 1, 1, 100.0, 60115.0, 60115, 60115, 60115.0, 60115.0, 60115.0, 60115.0, 0.016634783331947102, 0.012167434292605838, 0.008187432421192714], "isController": false}, {"data": ["26. POST /admin/api/v1/template-group/query", 1, 1, 100.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 10.2996826171875, 7.598876953125], "isController": false}, {"data": ["28. POST /admin/api/v1/pushkaGateway/query", 1, 1, 100.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 9.82392723880597, 6.223763992537313], "isController": false}, {"data": ["23. POST /admin/api/v1/invitation/query", 1, 1, 100.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 8.978949652777779, 6.754557291666667], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 1, 1, 100.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 10.05108173076923, 7.9326923076923075], "isController": false}, {"data": ["37. POST /widget/api/v1/cart", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 1.2182858910891088, 1.1916963180693068], "isController": false}, {"data": ["25. POST /admin/api/v1/paypoint/query", 1, 1, 100.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 9.898792613636363, 7.250236742424242], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 1, 1, 100.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 10.006009615384615, 7.016225961538462], "isController": false}, {"data": ["9. POST /admin/api/v1/tariff/query", 1, 1, 100.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 9.86919981060606, 6.214488636363636], "isController": false}, {"data": ["19. POST /admin/api/v1/customer/query", 1, 1, 100.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 10.2081298828125, 8.148193359375], "isController": false}, {"data": ["22. POST /admin/api/v1/user/query", 1, 1, 100.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 9.691642992424242, 6.924715909090909], "isController": false}, {"data": ["8. POST /admin/api/v1/age-raiting/query", 1, 1, 100.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 10.25390625, 7.2174072265625], "isController": false}, {"data": ["24. POST /admin/api/v1/gateway/query", 1, 1, 100.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 9.319196428571427, 5.873325892857142], "isController": false}, {"data": ["4. POST /admin/api/v1/venue/query", 1, 1, 100.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 8.232792721518987, 5.661590189873418], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 1, 1, 100.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 9.114583333333334, 6.035698784722222], "isController": false}, {"data": ["21. POST /admin/api/v1/contract/query", 1, 1, 100.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 10.05108173076923, 7.061298076923077], "isController": false}, {"data": ["41. POST /widget/api/v1/cart/{cartId}/ticket", 1, 1, 100.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 3.243468237704918, 1.8634733606557377], "isController": false}, {"data": ["5. POST /admin/api/v1/hall/query", 1, 1, 100.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 9.692747201492537, 7.083722014925373], "isController": false}, {"data": ["30. POST /admin/api/v1/sender-settings/query", 1, 1, 100.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 10.15625, 7.166466346153846], "isController": false}, {"data": ["32. GET /widget/api/v1/show/{showId}", 1, 0, 0.0, 1857.0, 1857, 1857, 1857.0, 1857.0, 1857.0, 1857.0, 0.5385029617662898, 0.3586513866451265, 0.26031149030694667], "isController": false}, {"data": ["33. POST /widget/api/v1/event/tabs/query", 1, 0, 0.0, 97.0, 97, 97, 97.0, 97.0, 97.0, 97.0, 10.309278350515465, 5.718427835051546, 5.507007087628866], "isController": false}, {"data": ["7. POST /admin/api/v1/event/query", 1, 1, 100.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 10.162353515625, 7.0343017578125], "isController": false}, {"data": ["34. POST /widget/api/v1/event/tabs/events/query", 1, 0, 0.0, 1218.0, 1218, 1218, 1218.0, 1218.0, 1218.0, 1218.0, 0.8210180623973727, 1.2018614018883416, 0.49469545361247946], "isController": false}, {"data": ["2. POST /admin/api/v1/state/query", 1, 1, 100.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 9.564568014705882, 6.620519301470588], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 1, 1, 100.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 9.650735294117647, 9.047564338235293], "isController": false}, {"data": ["35. GET /widget/api/v1/event/{eventId}", 1, 0, 0.0, 1838.0, 1838, 1838, 1838.0, 1838.0, 1838.0, 1838.0, 0.544069640914037, 1.7310340723612623, 0.26353373231773664], "isController": false}, {"data": ["39. GET /widget/api/v1/cart/{cartId}", 1, 0, 0.0, 816.0, 816, 816, 816.0, 816.0, 816.0, 816.0, 1.2254901960784315, 0.9370691636029412, 0.5924000459558824], "isController": false}, {"data": ["31. POST /admin/api/v1/progressbar/query", 1, 1, 100.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 9.249441964285714, 5.9291294642857135], "isController": false}, {"data": ["42. POST /widget/api/v1/order", 1, 1, 100.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 1.149779591480447, 1.0911312849162011], "isController": false}, {"data": ["Debug Sampler", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1509.27734375, 0.0], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 1, 1, 100.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 9.708180147058822, 7.137522977941176], "isController": false}, {"data": ["18. POST /admin/api/v1/cart/query", 1, 1, 100.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 9.550206801470587, 6.893382352941176], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 1, 2.9411764705882355, 2.380952380952381], "isController": false}, {"data": ["504/Gateway Time-out", 1, 2.9411764705882355, 2.380952380952381], "isController": false}, {"data": ["422/Unprocessable Entity", 1, 2.9411764705882355, 2.380952380952381], "isController": false}, {"data": ["401/Unauthorized", 31, 91.17647058823529, 73.80952380952381], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 42, 34, "401/Unauthorized", 31, "400/Bad Request", 1, "504/Gateway Time-out", 1, "422/Unprocessable Entity", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["3. POST /admin/api/v1/city/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["6. POST /admin/api/v1/show/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["16. POST /admin/api/v1/order/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["1. POST /admin/api/v1/country/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["20. POST /admin/api/v1/legalentity/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 1, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["26. POST /admin/api/v1/template-group/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["28. POST /admin/api/v1/pushkaGateway/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["23. POST /admin/api/v1/invitation/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["25. POST /admin/api/v1/paypoint/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["9. POST /admin/api/v1/tariff/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["19. POST /admin/api/v1/customer/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["22. POST /admin/api/v1/user/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["8. POST /admin/api/v1/age-raiting/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["24. POST /admin/api/v1/gateway/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["4. POST /admin/api/v1/venue/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["21. POST /admin/api/v1/contract/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["41. POST /widget/api/v1/cart/{cartId}/ticket", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["5. POST /admin/api/v1/hall/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["30. POST /admin/api/v1/sender-settings/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["7. POST /admin/api/v1/event/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["2. POST /admin/api/v1/state/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["31. POST /admin/api/v1/progressbar/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["42. POST /widget/api/v1/order", 1, 1, "422/Unprocessable Entity", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["18. POST /admin/api/v1/cart/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
