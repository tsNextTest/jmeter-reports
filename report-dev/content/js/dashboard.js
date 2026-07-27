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

    var data = {"OkPercent": 89.36170212765957, "KoPercent": 10.638297872340425};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8333333333333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "17. POST /admin/api/v1/payment/query"], "isController": false}, {"data": [1.0, 500, 1500, "29. POST /admin/api/v1/notification/system/query"], "isController": false}, {"data": [1.0, 500, 1500, "3. POST /admin/api/v1/city/query"], "isController": false}, {"data": [1.0, 500, 1500, "6. POST /admin/api/v1/show/query"], "isController": false}, {"data": [1.0, 500, 1500, "16. POST /admin/api/v1/order/query"], "isController": false}, {"data": [0.5, 500, 1500, "1. POST /admin/api/v1/country/query"], "isController": false}, {"data": [1.0, 500, 1500, "36. POST /widget/api/v1/event/{eventId}/root-tickets"], "isController": false}, {"data": [0.5, 500, 1500, "20. POST /admin/api/v1/legalentity/query"], "isController": false}, {"data": [1.0, 500, 1500, "13. POST /admin/api/v1/discount/query"], "isController": false}, {"data": [1.0, 500, 1500, "AUTH - Authorize Callback"], "isController": false}, {"data": [1.0, 500, 1500, "11. POST /admin/api/v1/ticket/query"], "isController": false}, {"data": [1.0, 500, 1500, "38. GET /widget/api/v1/event/{eventId}/tickets"], "isController": false}, {"data": [1.0, 500, 1500, "26. POST /admin/api/v1/template-group/query"], "isController": false}, {"data": [1.0, 500, 1500, "28. POST /admin/api/v1/pushkaGateway/query"], "isController": false}, {"data": [1.0, 500, 1500, "23. POST /admin/api/v1/invitation/query"], "isController": false}, {"data": [0.0, 500, 1500, "27. POST /admin/api/v1/terminal/query"], "isController": false}, {"data": [1.0, 500, 1500, "37. POST /widget/api/v1/cart"], "isController": false}, {"data": [0.5, 500, 1500, "AUTH - Connect Authorize"], "isController": false}, {"data": [1.0, 500, 1500, "25. POST /admin/api/v1/paypoint/query"], "isController": false}, {"data": [0.0, 500, 1500, "40. POST /widget/api/v1/cart/{cartId}/root-ticket"], "isController": false}, {"data": [1.0, 500, 1500, "12. POST /admin/api/v1/quota/query"], "isController": false}, {"data": [1.0, 500, 1500, "9. POST /admin/api/v1/tariff/query"], "isController": false}, {"data": [1.0, 500, 1500, "19. POST /admin/api/v1/customer/query"], "isController": false}, {"data": [1.0, 500, 1500, "22. POST /admin/api/v1/user/query"], "isController": false}, {"data": [1.0, 500, 1500, "8. POST /admin/api/v1/age-raiting/query"], "isController": false}, {"data": [1.0, 500, 1500, "24. POST /admin/api/v1/gateway/query"], "isController": false}, {"data": [1.0, 500, 1500, "4. POST /admin/api/v1/venue/query"], "isController": false}, {"data": [0.0, 500, 1500, "15. POST /admin/api/v1/service-fee/query"], "isController": false}, {"data": [1.0, 500, 1500, "21. POST /admin/api/v1/contract/query"], "isController": false}, {"data": [1.0, 500, 1500, "5. POST /admin/api/v1/hall/query"], "isController": false}, {"data": [1.0, 500, 1500, "30. POST /admin/api/v1/sender-settings/query"], "isController": false}, {"data": [0.5, 500, 1500, "32. GET /widget/api/v1/show/{showId}"], "isController": false}, {"data": [1.0, 500, 1500, "33. POST /widget/api/v1/event/tabs/query"], "isController": false}, {"data": [1.0, 500, 1500, "AUTH - Submit Login"], "isController": false}, {"data": [1.0, 500, 1500, "34. POST /widget/api/v1/event/tabs/events/query"], "isController": false}, {"data": [1.0, 500, 1500, "7. POST /admin/api/v1/event/query"], "isController": false}, {"data": [1.0, 500, 1500, "2. POST /admin/api/v1/state/query"], "isController": false}, {"data": [0.0, 500, 1500, "41. POST /widget/api/v1/order"], "isController": false}, {"data": [1.0, 500, 1500, "AUTH - Get Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "10. POST /admin/api/v1/root-ticket/query"], "isController": false}, {"data": [1.0, 500, 1500, "35. GET /widget/api/v1/event/{eventId}"], "isController": false}, {"data": [1.0, 500, 1500, "39. GET /widget/api/v1/cart/{cartId}"], "isController": false}, {"data": [1.0, 500, 1500, "AUTH - Exchange Token"], "isController": false}, {"data": [1.0, 500, 1500, "31. POST /admin/api/v1/progressbar/query"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "14. POST /admin/api/v1/dealer-discount/query"], "isController": false}, {"data": [1.0, 500, 1500, "18. POST /admin/api/v1/cart/query"], "isController": false}, {"data": [0.0, 500, 1500, "AUTH - Full Login Flow"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 47, 5, 10.638297872340425, 197.531914893617, 2, 876, 148.0, 496.80000000000007, 543.6, 876.0, 6.080993660240652, 200.7558030227067, 7.713314909755466], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 8.353960396039604, 16.040764232673265], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 1, 0, 0.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 26.72400841346154, 14.470027043269232], "isController": false}, {"data": ["3. POST /admin/api/v1/city/query", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 155.26887412383178, 7.155373831775701], "isController": false}, {"data": ["6. POST /admin/api/v1/show/query", 1, 0, 0.0, 131.0, 131, 131, 131.0, 131.0, 131.0, 131.0, 7.633587786259541, 10.764551526717558, 12.195849236641221], "isController": false}, {"data": ["16. POST /admin/api/v1/order/query", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 166.00518048128342, 9.138953877005347], "isController": false}, {"data": ["1. POST /admin/api/v1/country/query", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 7.472581129807692, 2.8714693509615383], "isController": false}, {"data": ["36. POST /widget/api/v1/event/{eventId}/root-tickets", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 7.829632675438596, 3.2837627923976607], "isController": false}, {"data": ["20. POST /admin/api/v1/legalentity/query", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 652.2664163213627, 2.879330686003683], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 1, 0, 0.0, 151.0, 151, 151, 151.0, 151.0, 151.0, 151.0, 6.622516556291391, 290.16840852649005, 10.334747516556291], "isController": false}, {"data": ["AUTH - Authorize Callback", 1, 0, 0.0, 148.0, 148, 148, 148.0, 148.0, 148.0, 148.0, 6.756756756756757, 12.536951013513514, 11.408625422297298], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 610.4769680669399, 5.709955601092896], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 5.2642822265625, 7.7362060546875], "isController": false}, {"data": ["26. POST /admin/api/v1/template-group/query", 1, 0, 0.0, 151.0, 151, 151, 151.0, 151.0, 151.0, 151.0, 6.622516556291391, 128.61522144039736, 10.386485927152318], "isController": false}, {"data": ["28. POST /admin/api/v1/pushkaGateway/query", 1, 0, 0.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 107.0, 9.345794392523365, 6.498247663551402, 14.009564836448599], "isController": false}, {"data": ["23. POST /admin/api/v1/invitation/query", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 637.0218211206897, 18.027119252873565], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 1, 1, 100.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 8.53259154040404, 16.137941919191917], "isController": false}, {"data": ["37. POST /widget/api/v1/cart", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 2.7192679558011053, 2.6761049723756907], "isController": false}, {"data": ["AUTH - Connect Authorize", 1, 0, 0.0, 876.0, 876, 876, 876.0, 876.0, 876.0, 876.0, 1.141552511415525, 0.712355522260274, 0.4269673944063927], "isController": false}, {"data": ["25. POST /admin/api/v1/paypoint/query", 1, 0, 0.0, 155.0, 155, 155, 155.0, 155.0, 155.0, 155.0, 6.451612903225806, 434.3371975806452, 10.06804435483871], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 1, 1, 100.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 18.692961836283185, 2.7352392146017697], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 1, 0, 0.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 117.0, 8.547008547008549, 226.22863247863248, 13.146033653846153], "isController": false}, {"data": ["9. POST /admin/api/v1/tariff/query", 1, 0, 0.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 117.0, 8.547008547008549, 327.7660924145299, 12.753739316239315], "isController": false}, {"data": ["19. POST /admin/api/v1/customer/query", 1, 0, 0.0, 141.0, 141, 141, 141.0, 141.0, 141.0, 141.0, 7.092198581560283, 409.2835771276596, 11.372451241134753], "isController": false}, {"data": ["22. POST /admin/api/v1/user/query", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 255.7668585526316, 16.200657894736842], "isController": false}, {"data": ["8. POST /admin/api/v1/age-raiting/query", 1, 0, 0.0, 114.0, 114, 114, 114.0, 114.0, 114.0, 114.0, 8.771929824561402, 263.41488486842104, 13.543379934210526], "isController": false}, {"data": ["24. POST /admin/api/v1/gateway/query", 1, 0, 0.0, 148.0, 148, 148, 148.0, 148.0, 148.0, 148.0, 6.756756756756757, 292.236328125, 10.088946368243244], "isController": false}, {"data": ["4. POST /admin/api/v1/venue/query", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 423.1936072335025, 7.762928299492385], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 1, 1, 100.0, 118.0, 118, 118, 118.0, 118.0, 118.0, 118.0, 8.474576271186441, 7.1835275423728815, 12.85255561440678], "isController": false}, {"data": ["21. POST /admin/api/v1/contract/query", 1, 0, 0.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 435.4643485915493, 10.852222711267606], "isController": false}, {"data": ["5. POST /admin/api/v1/hall/query", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 82.71742935336049, 3.17034750509165], "isController": false}, {"data": ["30. POST /admin/api/v1/sender-settings/query", 1, 0, 0.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 157.0, 6.369426751592357, 341.31792396496814, 9.858927149681529], "isController": false}, {"data": ["32. GET /widget/api/v1/show/{showId}", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 1.8274643841911764, 0.8939855238970588], "isController": false}, {"data": ["33. POST /widget/api/v1/event/tabs/query", 1, 0, 0.0, 127.0, 127, 127, 127.0, 127.0, 127.0, 127.0, 7.874015748031496, 4.636749507874016, 4.229207677165355], "isController": false}, {"data": ["AUTH - Submit Login", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 8.078231292517007, 3.388073979591837], "isController": false}, {"data": ["34. POST /widget/api/v1/event/tabs/events/query", 1, 0, 0.0, 140.0, 140, 140, 140.0, 140.0, 140.0, 140.0, 7.142857142857142, 7.331194196428571, 4.324776785714286], "isController": false}, {"data": ["7. POST /admin/api/v1/event/query", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 479.26240808823525, 5.633185891544117], "isController": false}, {"data": ["2. POST /admin/api/v1/state/query", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 85.49033717105263, 8.064350328947368], "isController": false}, {"data": ["41. POST /widget/api/v1/order", 1, 1, 100.0, 159.0, 159, 159, 159.0, 159.0, 159.0, 159.0, 6.289308176100629, 183.07168828616352, 4.931947720125786], "isController": false}, {"data": ["AUTH - Get Login Page", 1, 0, 0.0, 130.0, 130, 130, 130.0, 130.0, 130.0, 130.0, 7.6923076923076925, 73.4375, 3.4630408653846154], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 1, 0, 0.0, 129.0, 129, 129, 129.0, 129.0, 129.0, 129.0, 7.751937984496124, 41.076187015503876, 13.157097868217054], "isController": false}, {"data": ["35. GET /widget/api/v1/event/{eventId}", 1, 0, 0.0, 138.0, 138, 138, 138.0, 138.0, 138.0, 138.0, 7.246376811594203, 12.171648550724637, 3.531193387681159], "isController": false}, {"data": ["39. GET /widget/api/v1/cart/{cartId}", 1, 0, 0.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 7.63671875, 4.86328125], "isController": false}, {"data": ["AUTH - Exchange Token", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 6.495098039215686, 7.134650735294118], "isController": false}, {"data": ["31. POST /admin/api/v1/progressbar/query", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 7.85195707070707, 15.121922348484848], "isController": false}, {"data": ["Debug Sampler", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 2683.10546875, 0.0], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 1, 0, 0.0, 158.0, 158, 158, 158.0, 158.0, 158.0, 158.0, 6.329113924050633, 227.26710838607596, 9.920144382911392], "isController": false}, {"data": ["18. POST /admin/api/v1/cart/query", 1, 0, 0.0, 128.0, 128, 128, 128.0, 128.0, 128.0, 128.0, 7.8125, 18.707275390625, 12.115478515625], "isController": false}, {"data": ["AUTH - Full Login Flow", 1, 0, 0.0, 1703.0, 1703, 1703, 1703.0, 1703.0, 1703.0, 1703.0, 0.5871990604815032, 9.429017726071638, 3.128669994128009], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 4, 80.0, 8.51063829787234], "isController": false}, {"data": ["422/Unprocessable Entity", 1, 20.0, 2.127659574468085], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 47, 5, "500/Internal Server Error", 4, "422/Unprocessable Entity", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 1, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 1, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 1, 1, "422/Unprocessable Entity", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 1, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["41. POST /widget/api/v1/order", 1, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
