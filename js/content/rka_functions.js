function tampilAkun(id, jenis_ssh){
	jQuery('#idkomp').html('');
	jQuery('#hargakomp').html('');
	jQuery('#namakomp').html('');
  	jQuery('#spekkomp').html('');
  	jQuery('#satkomp').html('');
  	
  	jQuery('#table_komponen_akun').DataTable().clear();
  	jQuery('#table_komponen_akun').DataTable().destroy();

    var url_hal_item = '';
    if(jenis_ssh == 1){
      url_hal_item = url_ssh;
    }else if(jenis_ssh == 2){
      url_hal_item = url_sbu;
    }else if(jenis_ssh == 3){
      url_hal_item = url_hspk;
    }else if(jenis_ssh == 4){
      url_hal_item = url_asb;
    }
    relayAjax({
        url: url_hal_item,
        success: function(data_html){
          var url_get_item = data_html.split('lru6="')[1].split('"')[0];
        	relayAjax({
              url: url_get_item,
              type: "post",
              data: {
                _token: _token,
                v1bnA1m: v1bnA1m,
                DsK121m: id
              },
              success: function(data){
              	console.log('data', data);
              	window.data_ssh = data;
              	if(!data){
              		jQuery('#mod-komponen-akun').modal('hide');
              		jQuery('#wrap-loading').hide();
              		alert('ID Standar Harga '+id+' tidak ditemukan!');
              	}else{
      	          	jQuery('#idkomp').html(data['id_standar_harga']);
      	          	jQuery('#hargakomp').html(jQuery.fn.dataTable.render.number('.',',',0,'').display(data['harga']));
      	          	jQuery('#namakomp').html(data['kode_standar_harga']+' '+data['nama_standar_harga']);
      	          	jQuery('#spekkomp').html(data['spek']);
      	          	jQuery('#satkomp').html(data['satuan']);
      		      	jQuery('#table_komponen_akun').DataTable({
      			        pagingType: "full_numbers",
      			        dom:'tip',
      			        displayLength:20,
      			        ajax: {
      			            url: config.sipd_url+'daerah/main/?'+id,
                        type: 'post',
                        data: {
                          _token: _token,
                          v1bnA1m: v1bnA1m
                        },
      			            "dataSrc": function ( json ) {
      			                jQuery('#wrap-loading').hide();
      			                return json.data;
      			            }       
      			        },
      			        columns: [
      			          {data: 'id_akun', name: 'id_akun'},
      			          {data: 'nama_akun', name: 'nama_akun'},
      			          {data: 'action', name: 'action', orderable: false, searchable: false, className: 'text-right'},
      			        ],
      		      	});
      		      	jQuery('#table_komponen_akun tbody').on('click', 'tr', function () {
      		            var id_akun = jQuery(this).find('td').eq(0).text();
      		            var cek = jQuery('select[name="akun"]').find('option[value="'+id_akun+'||"]').text();
      		            if(!cek){
      		            	var jenis_bel = jQuery('select[name="jenisbl"] option:selected').text();
      		            	return alert('Akun Rekening belanja ini tidak masuk dalam jenis belanja '+jenis_bel);
      		            }
      		            var current_rekbel = jQuery('select[name="akun"]').val();
      	        		jQuery('#mod-komponen-akun').modal('hide');
      	        		jQuery('#wrap-loading').hide();
      		            
      		            jQuery('select[name="akun"]').val(id_akun+'||').trigger('change');

      		            jQuery("input[name=idkomponen]").val(data['id_standar_harga']);
      		            jQuery("input[name=komponen]").val(data['nama_standar_harga']);
      		            jQuery("input[name=spek]").val(data['spek']);
      		            jQuery("input[name=satuan]").val(data['satuan']);
      		            jQuery("input[name=hargasatuan]").val(data['harga']);
      	          	});

      		      	jQuery('.dttable2-filter').keyup(function(e){
      		        	jQuery('#table_komponen_akun').DataTable().search(jQuery(this).val()).draw();
      		      	});
      		    }
              },
              error: function(e){
              	console.log('data', e);
          		jQuery('#mod-komponen-akun').modal('hide');
          		jQuery('#wrap-loading').hide();
          		return alert('ID Standar Harga '+id+' tidak ditemukan!');
              }
        	});
        }
    });
}

function insertRKA(){
	var type_data = jQuery('#jenis_data').val();
    if(type_data == ''){
    	return alert('Jenis Data Excel tidak boleh kosong!');
    }
	var excel = jQuery('#file_output').val();
	if(excel ==''){
    	return alert('Data Excel tidak boleh kosong!');
	}
	excel = JSON.parse(excel);
	var id_kel = jQuery('select[name="kelurahan"] option').filter(function(){ return jQuery(this).html() == "Poncol"; }).val();
	var jenis_belanja = jQuery('#jenis-bel-excel').val();
	var id_rek_akun = jQuery('#rek-excel').val();
	var id_pengelompokan = jQuery('#paket-excel').val();
	var vol = jQuery('#volum-excel').val();
	var satuantext = jQuery('#satuan-excel option:selected').text();
	var satuan = jQuery('#satuan-excel').val();
	jQuery('.tambah-detil').click();
    if(
    	type_data == 'BOS'
        || type_data == 'HIBAH-BRG'
        || type_data == 'HIBAH'
        || type_data == 'BANSOS-BRG'
        || type_data == 'BANSOS'
    ){
        var sendData = excel.map(function(raw, i){
            return new Promise(function(resolve, reject){
                new Promise(function(resolve2, reject2){
                    var customFormData = new FormData();
                    customFormData.append('_token', tokek);
                    customFormData.append('v1bnA1m', v1bnA1m);
                    customFormData.append('DsK121m', C3rYDq('rekening='+id_rek_akun));
                    customFormData.append('columns[0][data]', 'id_profil');
                    customFormData.append('columns[0][name]', 'pr.id_profil');
                    customFormData.append('columns[0][searchable]', 'true');
                    customFormData.append('columns[0][orderable]', 'true');
                    customFormData.append('columns[0][search][value]', raw.id_profil);
                    customFormData.append('columns[0][search][regex]', 'false');
                    // cari nama penerima bantuan
                    relayAjax({
                        url: lru13,
                        type: "post",
                        data: customFormData,
                        processData: false,
                        contentType: false,
                        success: function(cari_penerima){
                            raw.resolve2 = resolve2;
                            console.log('cari_penerima', cari_penerima);
                            if(cari_penerima.data.length==0){
                                input_penerima(raw);
                            }else{
                                raw.id_profile = cari_penerima.data[0].id_profil;
                                resolve2(raw);
                            }
                        }
                    });
                })
                .then(function(raw2){
                    // console.log('raw2.id_profile', raw2.id_profile);
                    if(!raw2.id_profile){
                        raw2.error = "Penerima tidak ditemukan atau tidak bisa disimpan!";
                        resolve(raw2);
                    }else{
                        raw2.kodesbl = jQuery('input[name="kodesbl"]').val();
                        setKeterangan(raw2).then(function(id_ket){
                        raw2.detil_rincian = {
                            jenis_belanja: jenis_belanja,
                            id_rek_akun: id_rek_akun,
                            id_pengelompokan: id_pengelompokan,
                            id_keterangan: id_ket
                        };
                        var skrim = ''
                            +'kodesbl='+raw2.kodesbl
                            +'&idbelanjarinci='
                            +'&idakunrinci='
                            +'&jenisbl='+jenis_belanja
                            +'&akun='+encodeURIComponent(id_rek_akun)
                            +'&subtitle='+id_pengelompokan
                            +'&uraian_penerima='+raw2.nama
                            +'&id_penerima='+raw2.id_profile
                            +'&prop='+raw2.id_prov
                            +'&komponenkel='
                            +'&komponen='
                            +'&idkomponen='
                            +'&spek='
                            +'&satuan='+encodeURIComponent(satuantext)
                            +'&hargasatuan='+(+raw2.total.replace(/,/g, ''))
                            +'&keterangan='+id_ket
                            +'&volum1='+vol
                            +'&satuan1='+satuan
                            +'&volum2='
                            +'&satuan2='
                            +'&volum3='
                            +'&satuan3='
                            +'&volum4='
                            +'&satuan4=';
                        raw2.skrim = skrim;
                        var customFormData = new FormData();
                        customFormData.append('_token', tokek);
                        customFormData.append('v1bnA1m', v1bnA1m);
                        customFormData.append('DsK121m', C3rYDq(skrim));
                        // resolve(raw2); console.log(raw2);
                        relayAjax({
                            url: lru9,
                            type: "post",
                            data: customFormData,
                            processData: false,
                            contentType: false,
                            success: function(data_kel){
                                resolve(raw2);
                            },
                            error: function(jqXHR, textStatus, error){
                                raw2.error = 'Error ajax simpan rincian';
                                resolve(raw2);
                            }
                        });
                    })
                    }
                })
                .catch(function(e){
                    console.log(e);
                    return Promise.resolve({});
                });
            })
            .catch(function(e){
                console.log(e);
                return Promise.resolve({});
            });
        });
        Promise.all(sendData)
        .then(function(all_status){
            console.log('all_status', all_status);
            after_insert(all_status, type_data);
        })
        .catch(function(err){
            console.log('err', err);
            alert('Ada kesalahan sistem!');
            jQuery('#wrap-loading').hide();
        });
    }else if(
        type_data == 'BANKEU'
        || type_data == 'BAGI-HASIL'
    ){
    	getIdProv().then(function(data_prov){
    		var sendData = excel.map(function(raw, i){
    			return new Promise(function(resolve, reject){
    	      		var id_prov = jQuery('<select>'+data_prov+'</select>').find('option').filter(function(){
    	      			return jQuery(this).val() == raw.prov;
    	      		}).val();
    				// console.log('id_prov', id_prov, data_prov, raw.prov);
    	      		if(typeof id_prov == 'undefined'){
    	      			raw.error = 'Provinsi tidak ditemukan';
    	      			resolve(raw);
    	      		}else{
    					raw.id_prov = raw.prov;
    					getIdKab(raw).then(function(id_kab){
    			      		if(typeof id_kab == 'undefined'){
    			      			raw.error = 'Kabupaten / Kota tidak ditemukan';
    			      			resolve(raw);
    			      		}else{
    							raw.id_kab = id_kab;
    							getIdKec(raw).then(function(id_kec){
    					      		if(typeof id_kec == 'undefined'){
    					      			raw.error = 'Kecamatan tidak ditemukan';
    					      			resolve(raw);
    					      		}else{
    							      	raw.id_kec = id_kec;
    					      			getIdKel(raw).then(function(id_kel){
    							      		if(typeof id_kel == 'undefined'){
    							      			raw.error = 'Desa / Kelurahan tidak ditemukan';
    							      			resolve(raw);
    							      		}else{
    							      			raw.id_kel = id_kel;
    							      			raw.kodesbl = jQuery('input[name="kodesbl"]').val();
    							      			setKeterangan(raw).then(function(id_ket){
    								      			raw.detil_rincian = {
    								      				jenis_belanja: jenis_belanja,
    								      				id_rek_akun: id_rek_akun,
    								      				id_pengelompokan: id_pengelompokan,
    								      				id_keterangan: id_ket
    								      			};
    								      			var skrim = ''
    								      				+'kodesbl='+raw.kodesbl
    								      				+'&idbelanjarinci='
    								      				+'&idakunrinci='
    								      				+'&jenisbl='+jenis_belanja
    									      			+'&akun='+encodeURIComponent(id_rek_akun)
    									      			+'&subtitle='+id_pengelompokan
    									      			+'&uraian_penerima='
    									      			+'&id_penerima='
    									      			+'&prop='+raw.id_prov
    									      			+'&kab_kota='+raw.id_kab
    									      			+'&kecamatan='+raw.id_kec
    									      			+'&kelurahan='+raw.id_kel
    									      			+'&komponenkel='
    									      			+'&komponen='
    									      			+'&idkomponen='
    									      			+'&spek='
    									      			+'&satuan='+encodeURIComponent(satuantext)
    									      			+'&hargasatuan='+(+raw.total.replace(/,/g, ''))
    									      			+'&keterangan='+id_ket
    									      			+'&volum1='+vol
    									      			+'&satuan1='+satuan
    									      			+'&volum2='
    									      			+'&satuan2='
    									      			+'&volum3='
    									      			+'&satuan3='
    									      			+'&volum4='
    									      			+'&satuan4=';
    										        raw.skrim = skrim;
    										        // resolve(raw); console.log(raw);
                                                    var customFormData = new FormData();
                                                    customFormData.append('_token', tokek);
                                                    customFormData.append('v1bnA1m', v1bnA1m);
                                                    customFormData.append('DsK121m', C3rYDq(skrim));
                                                    // resolve(raw2); console.log(raw2);
                                                    relayAjax({
                                                        url: lru9,
                                                        type: "post",
                                                        data: customFormData,
                                                        processData: false,
                                                        contentType: false,
    										          	success: function(data_kel){
    								      					resolve(raw);
    										          	},
    										          	error: function(jqXHR, textStatus, error){
    										      			raw.error = 'Error ajax simpan rincian';
    										      			resolve(raw);
    										          	}
    										       	});
    							      			})
    							      		}
    								    })
    								    .catch(function(e){
    										raw.error = 'Error ajax kelurahan';
    				      					resolve(raw);
    								    });
    						      	}
    					        })
    						    .catch(function(e){
    								raw.error = 'Error ajax kecamatan';
    		      					resolve(raw);
    						    });
    				      	}
    			        })
    				    .catch(function(e){
    						raw.error = 'Error ajax kabupaten';
          					resolve(raw);
    				    });
    		      	}
    			})
    		    .catch(function(e){
    		        console.log(e);
    		        return Promise.resolve({});
    		    });
    		});
    		Promise.all(sendData)
    		.then(function(all_status){
    			console.log('all_status', all_status);
    			after_insert(all_status, type_data);
    		})
    	    .catch(function(err){
    	        console.log('err', err);
    			alert('Ada kesalahan sistem!');
    			jQuery('#wrap-loading').hide();
    	    });
        })
        .catch(function(err){
    		alert('Error ajax provinsi');
    		jQuery('#wrap-loading').hide();
        });
    }
}

function input_penerima(raw){
    // raw.res_input_penerima = 'Belum berani input penerima';
    // return raw.resolve2(raw);
    var customFormData = new FormData();
    customFormData.append('_token', tokek);
    customFormData.append('v1bnA1m', v1bnA1m);
    customFormData.append('DsK121m', C3rYDq(''
        +'jenis_penerima='+raw.jenis
        +'&nama_penerima='+raw.nama
        +'&nik_penerima='+raw.nik
        +'&alamat_penerima='+raw.alamat
        +'&prop_penerima='+raw.prov
        +'&kab_kota_penerima='+raw.kab
        +'&kecamatan_penerima='+raw.kec
        +'&kelurahan_penerima='+raw.kel
        +'&telp_penerima='+raw.tlp
    ));
    // insert penerima bantuan
    relayAjax({
        url: lru14,
        type: "post",
        data: customFormData,
        processData: false,
        contentType: false,
        success: function(res_input_penerima){
            raw.res_input_penerima = res_input_penerima;
            if(res_input_penerima.id_profil){
                raw.id_profile = res_input_penerima.id_profil;
                raw.resolve2(raw);
            }else{
                raw.resolve2(raw);
            }
        }
    });
}

function after_insert(all_status, type_data){
    jQuery('.close-form').click();
    relayAjax({
        url: lru10,
        type: "post",
        data: formData,
        processData: false,
        contentType: false,
        success: function(hasil){
            var res=hasil.split("||");
            var pagu, rinci;
            if(res[0]==0){ pagu=0; } else if(res[0]!=0){ pagu = jQuery.number(res[0],0,',','.'); }
            if(res[1]==0){ rinci=0; } else if(res[1]!=0){ rinci = jQuery.number(res[1],0,',','.'); }
            jQuery(".statustotalpagu").html(pagu);
            jQuery(".statustotalrincian").html(rinci);
            jQuery('#wrap-loading').hide();
            var _error = [];
            all_status.map(function(row, n){
                if(row.error){
                    if(type_data == 'dana-bos'){
                        _error.push('"'+row.nama+'" error: ('+row.error+')');
                    }else{
                        _error.push('"'+row.desa+'" error: ('+row.error+')');
                    }
                }
            });
            var catatan = '';
            if(_error.length > 0){
                catatan = ' Catatan: '+_error.join(', ');
            }
            alert('Berhasil simpan data!'+catatan);
        }
    });

    if(thpStatus=="murni"){
        jQuery('#table_rinci').DataTable().ajax.reload();
    }else if(thpStatus=="perubahan" || thpStatus=="pergeseran"){
        jQuery('#table_rinci_perubahan').DataTable().ajax.reload();
    }
}

function getIdProv(id_unit){
	return new Promise(function(resolve, reject){
  		relayAjax({
	      	url: lru4,
	      	type: "post",
            data: formData,
            processData: false,
            contentType: false,
	      	success: function(data_prov){
	      		resolve(data_prov);
        	},
        	error: function(jqXHR, textStatus, error){
      			reject();
        	}
        });
	});
}

function getIdKab(raw){
	return new Promise(function(resolve, reject){
        
        var customFormData = new FormData();
        customFormData.append('_token', tokek);
        customFormData.append('v1bnA1m', v1bnA1m);
        customFormData.append('DsK121m', C3rYDq('idprop='+raw.id_prov));
  		relayAjax({
        	url: lru5,
        	type: "post",
            data: customFormData,
            processData: false,
            contentType: false,
            success: function(data_kab){
	      		var id_kab = jQuery('<select>'+data_kab+'</select>').find('option').filter(function(){
	      			return jQuery(this).val() == raw.kab;
	      		}).val();
	      		resolve(id_kab);
          	},
          	error: function(jqXHR, textStatus, error){
      			reject();
          	}
        });
	});
}

function getIdKec(raw){
	return new Promise(function(resolve, reject){
        
        var customFormData = new FormData();
        customFormData.append('_token', tokek);
        customFormData.append('v1bnA1m', v1bnA1m);
        customFormData.append('DsK121m', C3rYDq('idprop='+raw.id_prov+'&idkokab='+raw.id_kab));
  		relayAjax({
          	url: lru6,
          	type: "post",
            data: customFormData,
            processData: false,
            contentType: false,
          	success: function(data_kec){
            	var id_kec = jQuery('<select>'+data_kec+'</select>').find('option').filter(function(){
	      			return jQuery(this).val() == raw.kec;
	      		}).val();
	      		resolve(id_kec);
          	},
          	error: function(jqXHR, textStatus, error){
      			reject();
          	}
        });
	});
}

function getIdKel(raw){
	return new Promise(function(resolve, reject){
        
        var customFormData = new FormData();
        customFormData.append('_token', tokek);
        customFormData.append('v1bnA1m', v1bnA1m);
        customFormData.append('DsK121m', C3rYDq('idprop='+raw.id_prov+'&idkokab='+raw.id_kab+'&idcamat='+raw.id_kec));
		relayAjax({
	      	url: lru7,
	      	type: "post",
            data: customFormData,
            processData: false,
            contentType: false,
	      	success: function(data_kel){
	        	var id_kel = jQuery('<select>'+data_kel+'</select>').find('option').filter(function(){
	      			return jQuery(this).val() == raw.desa;
	      		}).val();
	      		resolve(id_kel);
          	},
          	error: function(jqXHR, textStatus, error){
      			reject();
          	}
        });
	});
}

function setKeterangan(raw){
	return new Promise(function(resolve, reject){
		var id_keterangan = jQuery('#keterangan-excel').val();
		if(jQuery('#keterangan-otomatis').is(':checked')){
			var _id_keterangan = jQuery('#keterangan-excel').find('option').filter(function(){
      			return jQuery(this).html().toLocaleLowerCase() == raw.keterangan.toLocaleLowerCase();
      		}).val();
      		if(typeof _id_keterangan == 'undefined'){
                
                var customFormData = new FormData();
                customFormData.append('_token', tokek);
                customFormData.append('v1bnA1m', v1bnA1m);
                customFormData.append('DsK121m', C3rYDq('keterangan_add='+raw.keterangan));
				relayAjax({
		          	url: lru12,
		          	type: "POST",
                    data: customFormData,
                    processData: false,
                    contentType: false,
		          	success: function(data){
		          		jQuery("select[name=keterangan]").append('<option value ="'+data['id_ket_sub_bl']+'">'+data['ket_bl_teks']+'</option>');
              			jQuery("select[name=keterangan]").val(data['id_ket_sub_bl']).trigger("change");
		          		jQuery("#keterangan-excel").append('<option value ="'+data['id_ket_sub_bl']+'">'+data['ket_bl_teks']+'</option>');
              			jQuery("#keterangan-excel").val(data['id_ket_sub_bl']).trigger("change");
						return resolve(data['id_ket_sub_bl']);
		          	}
		        });
			}else{
				return resolve(_id_keterangan);
			}
		}else{
			return resolve(id_keterangan);
		}
	});
}

function filePicked(oEvent) {
    // Get The File From The Input
    var oFile = oEvent.target.files[0];
    var sFilename = oFile.name;
    // Create A File Reader HTML5
    var reader = new FileReader();

    reader.onload = function(e) {
      	var data = e.target.result;
      	var workbook = XLSX.read(data, {
        	type: 'binary'
      	});

        var cek = false;
      	workbook.SheetNames.forEach(function(sheetName) {
            if(sheetName != 'data'){ return; }
            cek = true;
            console.log('sheetName', sheetName);
	        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
	        var type_data = jQuery('#jenis_data').val();
	        var data = [];
            if(type_data == ''){
                return alert('Jenis Data Excel tidak boleh kosong!');
            }else if(
                type_data == 'BANKEU'
        		|| type_data == 'BAGI-HASIL'
            ){
	        	XL_row_object.map(function(row, i){
	        		data_pasti = {};
		        	data_pasti.no = row['NO'];
		        	data_pasti.desa = row['DESA'];
	        		data_pasti.total = row['PAGU'];
	        		data_pasti.keterangan = '';
	        		if(row['KETERANGAN']){
	        			data_pasti.keterangan = row['KETERANGAN'];
	        		}
	        		data_pasti.kec = row['KECAMATAN'];
	        		data_pasti.kab = row['KABUPATEN'];
	        		data_pasti.prov = row['PROVINSI'];
	        		data.push(data_pasti);
	        	});
	        }else if(
		        type_data == 'BOS'
		        || type_data == 'HIBAH-BRG'
		        || type_data == 'HIBAH'
		        || type_data == 'BANSOS-BRG'
		        || type_data == 'BANSOS'
	        ){
	        	XL_row_object.map(function(row, i){
                    data_pasti = {};
                    data_pasti.no = row['NO'];
                    data_pasti.id_profil = row['ID_PROFIL'];
                    data_pasti.nama = row['PENERIMA'];
                    data_pasti.total = row['PAGU'];
                    if(row['KETERANGAN']){
                        data_pasti.keterangan = row['KETERANGAN'];
                    }
                    data_pasti.jenis = row['JENIS'];
                    data_pasti.nik = row['NIK'];
                    data_pasti.alamat = row['ALAMAT'];
                    data_pasti.kel = row['KELURAHAN'];
                    data_pasti.kec = row['KECAMATAN'];
                    data_pasti.kab = row['KABUPATEN'];
                    data_pasti.prov = row['PROVINSI'];
                    data_pasti.tlp = row['TLP'];
                    data.push(data_pasti);
	        		// console.log('b', b);
	        	});
            }
	        console.log(data);
            var json_object = JSON.stringify(data);
		    jQuery("#file_output").val(json_object);
      	});
      	if(!cek){
      		alert('Nama sheet "data" tidak ditemukan!');
      	}
	};

    reader.onerror = function(ex) {
      console.log(ex);
    };

    reader.readAsBinaryString(oFile);
}

function select_all(opsi){
	var tr_id = opsi.start;
	var type = opsi.type;
	var checked = opsi.checked;
	if(type == 'all'){
		jQuery('.hapus-multi-komponen').prop('checked', checked);
	}else{
		var cek = false;
		jQuery('#table_rinci tbody tr').map(function(i, b){
			if(i > tr_id && !cek){
				var td = jQuery(b).find('td');
				if(td.length == 1){
					var text = td.eq(0).text();
					if(type == 'kelompok' && text.indexOf('[#]') != -1){
						cek = true;
					}else if(
						type == 'keterangan' 
						&& (text.indexOf('[#]') != -1 || text.indexOf('[-]') != -1)
					){
						cek = true;
					}else if(
						type == 'rekening'
					){
						cek = true;
					}
				}
				if(!cek){
					td.eq(0).find('.hapus-multi-komponen').prop('checked', checked);
				}
			}
		});
	}
}

function gantiRekKomponen(type, selected){
	jQuery('#wrap-loading').show();
	jQuery('#mod-ganti-rek').modal('show');
	var id_unit = window.location.href.split('?')[0].split(''+config.id_daerah+'/')[1];
	var jenisbl = jQuery('select[name="jenisbl"]').val();
	jQuery('#ganti-jbl-asal').html(jQuery('select[name="jenisbl"]').html());
	jQuery('#ganti-jbl-asal').val(jenisbl);
	jQuery('#simpan-ganti-rek').attr('data-type', type);
	jQuery('.ganti-jbl').hide();
	jQuery('.ganti-rekening').hide();
	jQuery('.ganti-kelompok').hide();
	jQuery('.ganti-keterangan').hide();
	if(selected){
		jQuery('#ganti-selected').val(selected.join(','));
	}else{
		jQuery('#ganti-selected').val(jQuery('input[name="idbelanjarinci"').val());
	}
	var kelompok_asal = jQuery('select[name="subtitle"]').val();
	jQuery('.ganti-kelompok').show();
	jQuery('.ganti-keterangan').show();
	jQuery('#ganti-kelompok-asal').html(jQuery('select[name="subtitle"]').html());
	jQuery('#ganti-kelompok-asal').val(kelompok_asal);
  	jQuery("#pilih-ganti-kelompok").html(jQuery('select[name="subtitle"]').html());
  	jQuery("#pilih-ganti-kelompok").val(kelompok_asal);
	var keterangan_asal = jQuery('select[name="keterangan"]').val();
	jQuery('#ganti-keterangan-asal').html(jQuery('select[name="keterangan"]').html());
	jQuery('#ganti-keterangan-asal').val(keterangan_asal);
  	jQuery("#pilih-ganti-keterangan").html(jQuery('select[name="keterangan"]').html());
  	jQuery("#pilih-ganti-keterangan").val(keterangan_asal);
	if(!type || type == 'rekening'){
		jQuery('.ganti-jbl').show();
		jQuery('.ganti-rekening').show();
		jQuery('#mod-ganti-rek h4.modal-title').text('Ganti Rekening Sesuai Jenis Belanja');
		var rek_asal = jQuery('select[name="akun"]').val();
		jQuery('#ganti-rek-asal').html(jQuery('select[name="akun"]').html());
		jQuery('#ganti-rek-asal').val(rek_asal);
    
        var customFormData = new FormData();
        customFormData.append('_token', tokek);
        customFormData.append('v1bnA1m', v1bnA1m);
        customFormData.append('DsK121m', C3rYDq("komponenkel="+jenisbl));
        relayAjax({
            url: lru3,
            type: "post",
            data: customFormData,
            processData: false,
            contentType: false,
		    success: function(data){
		      	jQuery("#pilih-ganti-rek").html(data);
		      	jQuery("#pilih-ganti-rek").val(rek_asal);
				    jQuery('#wrap-loading').hide();
		    }
		});
	} else if(type == 'kelompok' || type == 'keterangan'){
		jQuery('#mod-ganti-rek h4.modal-title').text('Ganti Kelompok atau Keterangan');
		jQuery('#wrap-loading').hide();
	}
}

function ubahKomponenAll(type, that){
	var selected = [];
	var checkbox = jQuery(that).parent().find('input');
	var kelompok = checkbox.attr('kelompok');
	var keterangan = checkbox.attr('keterangan');
	var rekening = checkbox.attr('rekening');
	jQuery('.hapus-multi-komponen').map(function(i, b){
		if(jQuery(b).is(':checked')){
			var _kelompok = jQuery(b).attr('kelompok');
			var _keterangan = jQuery(b).attr('keterangan');
			var _rekening = jQuery(b).attr('rekening');
			var val = jQuery(b).val();
			if(
				val
				&& (
					(
						type == 'rekening'
						&& _kelompok == kelompok
						&& _keterangan == keterangan
						&& _rekening == rekening
					)
					|| (
						type == 'keterangan'
						&& _kelompok == kelompok
						&& _keterangan == keterangan
					)
					|| (
						type == 'kelompok'
						&& _kelompok == kelompok
					)
				)
			){
				selected.push(val);
			}
		}
	});
	if(selected.length == 0){
		alert('Pilih komponen dulu!');
	}else{
		console.log('selected', selected);
        setTimeout(function(){
    		ubahKomponen(selected[0], function(){
    			gantiRekKomponen(type, selected);
    		});
        }, 500);
	}
}

function tampil_edit_del(){
  var kd_sbl = get_kd_sbl();
  var id_unit = window.location.href.split('?')[0].split(''+config.id_daerah+'/')[1];
  jQuery('#table_rinci_perubahan').DataTable().destroy();
  jQuery('#table_rinci_perubahan').DataTable({
      scrollY:'50vh',
      autoWidth: true,
      serverSide: false,
      responsive: true,
      processing: true,
      pagingType: "full_numbers",
      dom:'prltip',
      pageLength: 20,
      lengthMenu: [
          [20, 50, 100, -1],
          [20, 50, 100, "All"] // change per page values here
      ],
      language: {
          search: '<span>Filter:</span> _INPUT_',
          lengthMenu: '<span>Tampil:</span> _MENU_ <span>baris</span>',
      },
      ajax: {
          url: config.sipd_url+'daerah/main/'+get_type_jadwal()+'/belanja/'+config.tahun_anggaran+'/rinci/tampil-rincian/'+config.id_daerah+'/'+id_unit+'?kodesbl='+kd_sbl
      },
      columns: [
        {
            class: "details-control",
            orderable: false,
            searchable: false,
            data: null,
            defaultContent: "<span class='p-l-10'><i class='fa fa-lg fa-info-circle text-info'></i></span>"
        },
        {data: 'subs_bl_teks', name: 'sb.subs_bl_teks', orderable: false,},
        {data: 'ket_bl_teks', name: 'kt.ket_bl_teks', orderable: false,},
        {data: 'nama_akun', name: 'ak.nama_akun', orderable: false,},
        // {data: 'nama_standar_harga', name: 'kk.nama_standar_harga', orderable: false,},
        {
            className:"",
            orderable: false,
            searchable: true,
            data: 'nama_standar_harga',
            name: 'kk.nama_standar_harga',
            render: function(data,type,full,meta){
              if(data['spek_komponen']!=null){
                return "<h5>"+data['nama_komponen']+"</h5><h5>"+data['spek_komponen']+"</h5>"+full['id_rinci_sub_bl'];
              }
              else{
                return "<h5>"+data['nama_komponen']+"</h5>";
              }
              
            }
        },
        {data: 'satuan', name: 'kk.satuan', orderable: false,},
        {data: 'koefisien_murni', name: 'hrd.koefisien_murni', orderable: false, searchable: false,},
        {data: 'harga_satuan_murni', name: 'hrd.harga_satuan_murni', orderable: false, searchable: false, className: 'text-right', render: $.fn.dataTable.render.number('.',',',0,'')},
        {data: 'pajak_murni', name: 'pajak_murni', orderable: false, searchable: false, className: 'text-right', render: $.fn.dataTable.render.number('.',',',0,'')},
        {data: 'rincian_murni', name: 'hrd.rincian_murni', orderable: false, searchable: false, className: 'text-right', render: $.fn.dataTable.render.number('.',',',0,'')},
        {data: 'koefisien', name: 'rd.koefisien', orderable: false,},
        {data: 'harga_satuan', name: 'rd.harga_satuan', orderable: false, searchable: false, className: 'text-right', render: $.fn.dataTable.render.number('.',',',0,'')},
        {data: 'totalpajak', name: 'totalpajak', orderable: false, searchable: false, className: 'text-right', render: $.fn.dataTable.render.number('.',',',0,'')},
        {data: 'rincian', name: 'rd.rincian', orderable: false, searchable: false, className: 'text-right', render: $.fn.dataTable.render.number('.',',',0,'')},
        {
          data: 'action', 
          name: 'action', 
          orderable: false, 
          searchable: false, 
          className: 'text-center', 
          render: function(data,type,full,meta){
            if(!data){
              return ''
              +'<a href="javascript:;" onclick="ubahKomponen(\''+kd_sbl+'\',\''+full.id_rinci_sub_bl+'\')" class="btn btn-info btn-outline btn-circle m-r-5"><i class="ti-pencil-alt"></i></a>'
              +'<a href="javascript:;" onclick="hapusKomponen(\''+kd_sbl+'\',\''+full.id_rinci_sub_bl+'\')" class="btn btn-danger btn-outline btn-circle"><i class="ti-trash"></i></a>';
            }else{
              return data;
            }
          }
      },
      ],
      columnDefs: [
        {visible: false,targets: 1},
        {visible: false,targets: 2},
        {visible: false,targets: 3},
      ],
      order: [
        [1, 'asc'],
        [2, 'asc'],
        [3, 'asc'],
      ],
      drawCallback: function(settings) {
        var api = this.api();
        var rows = api.rows({ page: 'current' }).nodes();
        var last = null;
        var last2 = null;
        var last3 = null;
        api.column(1, { page: 'current' }).data().each(function(group, i) {
          if(group!==null){
            if (last !== group) {
                $(rows).eq(i).before('<tr class="group"><td colspan="15" class="font-xbold">' + group + '</td></tr>');
                last = group;
            }
          }
        });
        api.column(2, { page: 'current' }).data().each(function(group, i) {
          if(group!==null){
            var rowData = api.column(1,{ page: 'current' }).data();
            var group1 = rowData[i] + "." + group;
            if (last2 !== group1) {
                $(rows).eq(i).before('<tr class="group"><td colspan="15" class="font-bold">' + group + '</td></tr>');
                last2 = group1;
            }
          }
        });
        api.column(3, { page: 'current' }).data().each(function(group, i) {
            var rowData = api.column(1,{ page: 'current' }).data();
            var rowData2 = api.column(2,{ page: 'current' }).data();
            var group1 = rowData[i] + "." + rowData2[i] + "." + group;
            if (last3 !== group1) {
                $(rows).eq(i).before('<tr class="group"><td colspan="15" class="font-medium">' + group + '</td></tr>');
                last3 = group1;
            }
        });
      }
    });
}

function get_kd_sbl(){
  var kode_sbl = false;
  jQuery('script').map(function(i, b){
    var script = jQuery(b).html();
    script = script.split('?kodesbl=');
    if(script.length > 1){
      script = script[1].split("'");
      kode_sbl = script[0];
    }
  });
  return kode_sbl;
}

function get_kd_bl(){
  var kode_sbl = get_kd_sbl();
  var _kode_bl = kode_sbl.split('.');
  _kode_bl.pop();
  kode_bl = _kode_bl.join('.');
  return kode_bl;
}

function get_type_jadwal(){
    if(jQuery('button[onclick="setFase()"]').text().indexOf('Perencanaan') == -1){
        return 'budget';
    }else{
        return 'plan';
    }
}

function relayAjax(options, retries=20, delay=30000, timeout=90000){
    options.timeout = timeout;
    jQuery.ajax(options)
    .fail(function(){
        if (retries > 0) {
            console.log('Koneksi error. Coba lagi '+retries);
            setTimeout(function(){ 
                relayAjax(options, --retries, delay, timeout);
            },delay);
        } else {
            alert('Capek. Sudah dicoba berkali-kali error terus. Maaf, berhenti mencoba.');
        }
    });
}

function tampil_profil(){
	jQuery('#wrap-loading').show();
	var data = [];
	jQuery('.dataTable td a.btn-info').map(function(){
		var url = jQuery(this).attr('onclick').split("ubahKomponen('")[1].split("'")[0];
		data.push(url);
	});
	if(data.length == 0){
		alert('Tombol edit tidak ditemukan. Harap buka rincian dulu!');
	}
	var sendData = data.map(function(kode_get_rka, i){
		return new Promise(function(resolve, reject){
			relayAjax({
				url: endog+'?'+kode_get_rka,
				type: 'POST',
				data: formData,
				processData: false,
				contentType: false,
				success: function(rinci){
					rinci.kode_get_rka = kode_get_rka;
					if(
						!rinci.id_penerima
						&& rinci.id_prop_penerima
					){
						getProv(id_unit, rincsub[kode_sbl].lru4).then(function(prov){
							if(prov[rinci.id_prop_penerima]){
								rinci.nama_prop = prov[rinci.id_prop_penerima].nama;
								getKab(id_unit, rinci.id_prop_penerima, rincsub[kode_sbl].lru5).then(function(kab){
									if(kab[rinci.id_kokab_penerima]){
										rinci.nama_kab = kab[rinci.id_kokab_penerima].nama;
										getKec(id_unit, rinci.id_prop_penerima, rinci.id_kokab_penerima, rincsub[kode_sbl].lru6).then(function(kec){
											if(kec[rinci.id_camat_penerima]){
												rinci.nama_kec = kec[rinci.id_camat_penerima].nama;
												getKel(id_unit, rinci.id_prop_penerima, rinci.id_kokab_penerima, rinci.id_camat_penerima, rincsub[kode_sbl].lru7).then(function(kel){
													if(kel[rinci.id_lurah_penerima]){
														rinci.nama_kel = kel[rinci.id_lurah_penerima].nama;
														return resolve(rinci);
													}else{
														return resolve(rinci);
													}
												});
											}else{
												return resolve(rinci);
											}
										});
									}else{
										return resolve(rinci);
									}
								});
							}else{
								return resolve(rinci);
							}
						});
					}else{
						return resolve(rinci);
					}
				},
				error: function(e){
					return resolve(false)
				}
			});
		});
	});
	Promise.all(sendData)
	.then(function(val_all){
		val_all.map(function(rinci, i){
			var action = rinci.kode_get_rka;
			var key = '.dataTable td a.btn-info[onclick="ubahKomponen(\''+action+'\')"]';
			console.log('key', key, rinci);
			var tr = jQuery(key).closest('tr');
			new Promise(function(resolve, reject){
				if(tr.length >= 1){
					if(tr.find('td').eq(1).find('.info-profil').length == 0){
						tr.find('td').eq(1).append('<span class="info-profil"></span>');
					}
					var info = '';
					if(rinci.nama_prop){
						info += rinci.rka.lokus_akun_teks+', '+rinci.nama_kel+', '+rinci.nama_kec+', '+rinci.nama_kab+', '+rinci.nama_prop
						resolve(info);
					}else if(rinci.id_penerima){
	                    var customFormData = new FormData();
	                    customFormData.append('_token', tokek);
	                    customFormData.append('v1bnA1m', v1bnA1m);
	                    customFormData.append('DsK121m', C3rYDq('rekening=8681||bos'));
	                    customFormData.append('columns[0][data]', 'id_profil');
	                    customFormData.append('columns[0][name]', 'pr.id_profil');
	                    customFormData.append('columns[0][searchable]', 'true');
	                    customFormData.append('columns[0][orderable]', 'true');
	                    customFormData.append('columns[0][search][value]', rinci.id_penerima);
	                    customFormData.append('columns[0][search][regex]', 'false');
	                    // cari nama penerima bantuan
	                    relayAjax({
	                        url: lru13,
	                        type: "post",
	                        data: customFormData,
	                        processData: false,
	                        contentType: false,
	                        success: function(cari_penerima){
	                            console.log('cari_penerima', cari_penerima);
	                            if(cari_penerima.data.length==0){
									info += rinci.lokus_akun_teks;
									resolve(info);
	                            }else{
	                            	var penerima = cari_penerima.data[0];
	                                info += penerima.nama_teks+', '+penerima.alamat_teks+' ('+penerima.jenis_penerima+')';
									resolve(info);
	                            }
	                        }
	                    });
					}else{
						info += rinci.lokus_akun_teks;
						resolve(info);
					}
				}
			})
            .then(function(info){
				tr.find('td').eq(1).find('.info-profil').html(info);
			});
		})
		jQuery('#wrap-loading').hide();
	});
}