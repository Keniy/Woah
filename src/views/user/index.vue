<template>
	<div class="app-container calendar-list-container" id="userlist">
		<div class="filter-container">
			<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('userlist.name')" v-model="searchParams.username">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" type="info" v-waves icon="el-icon-trash" @click="handleReset">{{$t('table.reset')}}</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-edit" @click="handleAdd">{{$t('table.add')}}</el-button>
		</div>

		<el-table :data="tableData" border fit highlight-current-row style="width: 100%"
	    :row-class-name="tableRowClassName">
	    <el-table-column align="center" prop="id" :label="$t('table.code')" width="70"></el-table-column>
	    <el-table-column align="center" prop="username" :label="$t('userlist.name')"></el-table-column>
	    <el-table-column align="center" prop="nickname" :label="$t('userlist.nickname')"></el-table-column>
	    <el-table-column align="center" prop="telephone" :label="$t('userlist.telephone')"></el-table-column>
	    <el-table-column align="center" prop="email" :label="$t('userlist.email')"></el-table-column>
	    <el-table-column align="center" prop="address" :label="$t('userlist.address')"></el-table-column>
	    <el-table-column align="center" prop="enabled" :label="$t('table.status')" width="100">
	    	<template slot-scope="scope">
	    		<template v-if="scope.row.status">
	    			<el-tag type="success">有效</el-tag>
	    		</template>
	    		<template v-if="!scope.row.status">
	    			<el-tag type="danger">无效</el-tag>
	    		</template>
	    	</template>
	    </el-table-column>
	    <el-table-column align="center" :label="$t('table.actions')" class-name="small-padding fixed-width">
	    	<template slot-scope="scope">
	    		<el-button v-if="scope.row.status" type="info" size="mini" @click="handlePublish(scope.row, false)">{{$t('table.disabled')}}</el-button>
	    		<el-button v-if="!scope.row.status" type="success" size="mini" @click="handlePublish(scope.row, true)">{{$t('table.enabled')}}</el-button>
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

	  <el-dialog :title="$t(textMap[dialogStatus])" :visible.sync="dialogFormVisible"> 
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="150px">
      	<el-row :gutter="24">
      		<el-col :span="12">
      			<el-form-item :label="$t('userlist.name')" prop="username" :rules="rules.input">
		        	<el-input v-model="temp.username" :placeholder="$t('userlist.name')"></el-input>
		        </el-form-item>
		        <el-form-item :label="$t('userlist.nickname')" prop="nickname" :rules="rules.input">
		        	<el-input v-model="temp.nickname" :placeholder="$t('userlist.nickname')"></el-input>
		        </el-form-item>
		        <el-form-item :label="$t('userlist.telephone')">
		        	<el-input v-model="temp.telephone" :placeholder="$t('userlist.telephone')"></el-input>
		        </el-form-item>
		        <el-form-item :label="$t('userlist.email')">
		          <el-input v-model="temp.email" :placeholder="$t('userlist.email')"></el-input>
		        </el-form-item>
		        <el-form-item :label="$t('userlist.address')">
		          <el-input v-model="temp.address" :placeholder="$t('userlist.address')"></el-input>
		        </el-form-item>
		        <el-form-item :label="$t('table.status')" prop="status" :rules="rules.select">
		          <el-select class="filter-item" v-model="temp.status" :placeholder="$t('table.select')" clearable>
		            <el-option v-for="item in option.status" :key="item.value" :label="item.label" :value="item.value">
		            </el-option>
		          </el-select>
		        </el-form-item>
		        <el-form-item :label="$t('table.remark')">
		          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :placeholder="$t('table.input')" v-model="temp.remark">
		          </el-input>
		        </el-form-item>
      		</el-col>

      		<el-col :span="12">
      			<el-form-item :label="$t('userlist.userface')">
      				<el-upload
							  class="avatar-uploader"
							  :data="upload.params"
							  :action="api.upload"
							  :show-file-list="false"
							  :on-success="handleAvatarSuccess"
							  :before-upload="beforeAvatarUpload">
							  <img v-if="temp.userface" :src="temp.userface" class="avatar">
							  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
      			</el-form-item>
      		</el-col>
      	</el-row>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="addUser">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
	</div>
</template>
<style lang="scss">
	#userlist {
		.avatar-uploader .el-upload {
	    border: 1px dashed #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	  }
	  .avatar-uploader .el-upload:hover {
	    border-color: #409EFF;
	  }
	  .avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 178px;
	    height: 178px;
	    line-height: 178px;
	    text-align: center;
	  }
	  .avatar {
	    width: 178px;
	    height: 178px;
	    display: block;
	  }
	}
</style>
<script>
	import waves from '@/directive/waves' // 水波纹指令
	import rules from '@/public/rules'
	export default {
		name: 'userTable',
		directives: {
	    waves
	  },
	  mixins: [ rules ],
		created() {
			this.init()
			console.log(this.$util)
			this.defaultData = this.$util.copy(this.temp)
		},
		data() {
			return {
				total: 0,
				searchParams: {
					page: 1,
					rows: 10,
					username: null
				},
				option: {
					status: [{
						label: '有效', value: true
					}, {
						label: '无效', value: false			
					}]
				},
				dialogStatus: '',
				dialogFormVisible: false,
      	dialogStatus: '',
				textMap: {
	        update: 'Edit',
	        create: 'Create'
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
					list: '/api/user/list',
					load: '/api/user/',
					save: '/api/user/save',
					upload: '/api/user/upload',
					updateStatus: '/api/user/updateStatus',
					delete: '/api/user/delete/'
				},
				upload: {
					params: {
						id: null
					}
				},
				imageUrl: ''
			}
		},
		methods: {
			tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
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
			loadUser(id) {
				this.upload.params.id = id
				this.getRequest(this.api.load + id).then((resp) => {
					this.temp = resp.data
				})
			},
			handleFilter() {
				this.init()
			},
			handleReset() {
				this.searchParams.username = null;
			},
			resetTemp() {
	      this.temp = Object.assign(this.temp, this.defaultData)
	    },
			handleAdd() {
				this.resetTemp()
	      this.dialogStatus = 'create'
	      this.dialogFormVisible = true
	      this.$nextTick(() => {
	        this.$refs['dataForm'].clearValidate()
	      })
			},
			handleUpdate(row) {
				this.loadUser(row.id)
	      this.dialogStatus = 'update'
	      this.dialogFormVisible = true
	      this.$nextTick(() => {
	        this.$refs['dataForm'].clearValidate()
	      })
			},
			handlePublish(row, status) {
				this.postRequest(this.api.updateStatus, { id: row.id, status }).then((resp) => {
					const data = resp.data
					this.$message({
						type: 'success',
						message: data.msg
					})
					this.init()
				})
			},
			handleDelete(row) {
				this.$confirm('此操作将删除该用户，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.getRequest(this.api.delete + row.id).then((resp) => {
						this.$message({
							type: 'success',
							message: '删除成功'
						})
						this.init()
					}).catch((error) => {
						this.$message({
							type: 'success',
							message: '删除失败'
						})
					})
				}).catch(() => {
					this.$message({
            type: 'info',
            message: '已取消删除'
          }); 
				})
			},
			addUser() {
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						this.postRequest(this.api.save, this.temp).then((resp) => {
							const data = resp.data
							this.$message({
								type: 'success',
								message: data.msg
							})
							this.dialogFormVisible = false
							this.init()
						})
					} else {

					}
				})
			},
			cancel() {
				this.dialogFormVisible = false
			},
			handleAvatarSuccess(res, file) {
        this.temp.userface = res.msg
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
		}
	}
</script>