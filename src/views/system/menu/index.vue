<template>
	<div class="app-container calendar-list-container" id="menuList">
		<div class="filter-container">
			<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('menulist.nameZh')" v-model="searchParams.name">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" type="info" v-waves icon="el-icon-trash" @click="handleReset">{{$t('table.reset')}}</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-edit" @click="handleAdd">{{$t('table.add')}}</el-button>
		</div>

		<el-table :data="tableData" border fit highlight-current-row style="width: 100%">
	    <el-table-column align="center" prop="id" :label="$t('table.code')" width="70"></el-table-column>
	    <el-table-column align="center" prop="parentId" :label="$t('menulist.parent')" width="70"></el-table-column>
	    <el-table-column align="center" prop="path" :label="$t('menulist.path')"></el-table-column>
	    <el-table-column align="center" prop="name" :label="$t('menulist.name')"></el-table-column>
	    <el-table-column align="center" prop="nameZh" :label="$t('menulist.nameZh')"></el-table-column>
	    <el-table-column align="center" prop="component" :label="$t('menulist.component')"></el-table-column>
	    <el-table-column align="center" prop="iconCls" :label="$t('menulist.iconCls')"></el-table-column>
	    <el-table-column align="center" :label="$t('table.actions')" class-name="small-padding fixed-width">
	    	<template slot-scope="scope">
	    		<el-button v-if="scope.row.username !='admin'" type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
	    		<el-button v-if="scope.row.username !='admin'" type="danger" size="mini" @click="handleDelete(scope.row)">{{$t('table.delete')}}
          </el-button>
	    	</template>
	    </el-table-column>
	  </el-table>

	  <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParams.page" :page-sizes="[10,20,30,50]" 
      	:page-size="searchParams.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
	</div>
</template>
<script>	
	import waves from '@/directive/waves' // 水波纹指令
	import rules from '@/public/rules'

	export default {
		name: 'menuTable',
		directives: {
			waves
		},
		created() {

		},
		mounted() {
			this.init()
		},
		data() {
			return {
				total: 0,
				searchParams: {
					page: 1,
					rows: 10,
					name: null
				},
	      temp: {
	        id: null,
	        status: true,
	        remark: null,
	        username: null,
	        password: null,
	        nickname: null,
	        telephone: null,
	        email: null,
	        address: null,
	        userface: null
	      },
	      rules: {

	      },
				tableData: [],
				api: {
					list: '/api/menu/list',
					load: '/api/menu/',
					save: '/api/menu/addMenu',
					delete: '/api/menu/delete/'
				}
			}
		},
		methods: {
			init() {
				this.postRequest(this.api.list, this.searchParams).then((resp) => {
					const data = resp.data
					this.tableData = data.records
					this.total = data.total
				})
			},
			handleSizeChange(val) {
	      this.searchParams.rows = val
	      this.init()
	    },
	    handleCurrentChange(val) {
	      this.searchParams.page = val
	      this.init()
	    },
	    handleFilter() {
				this.init()
			},
			handleReset() {
				this.searchParams.name = null;
			},
			resetTemp() {
	      this.temp = Object.assign(this.temp, this.defaultData)
	    }
			
		}
	}
</script>