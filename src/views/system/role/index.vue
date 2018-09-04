<template>
	<div class="app-container calendar-list-container" id="roleList">
		<div style="text-align: left" v-loading="loading">
      <el-input placeholder="请输入角色英文名称..."
                size="mini"
                style="width: 250px"
                v-model="newRole">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input
        placeholder="请输入角色中文名称..."
        size="mini"
        style="width: 250px"
        v-model="newRoleZh">
      </el-input>
      <el-button type="primary" size="mini" style="margin-left: 5px" @click="addNewRole">添加角色</el-button>
    </div>
    <div style="margin-top: 10px;text-align: left">
      <el-collapse v-model="activeColItem" accordion style="width: 500px;" @change="collapseChange">
        <el-collapse-item v-for="(item,index) in roles" :title="item.nameZh" :name="item.id" :key="item.name">
          <el-card class="box-card">
            <div slot="header">
              <span>可访问的资源</span>
              <el-button type="text"
                         style="color: #f6061b;margin: 0px;float: right; padding: 3px 0;width: 15px;height:15px"
                         icon="el-icon-delete" @click="deleteRole(item.id,item.nameZh)"></el-button>
            </div>
            <div>
              <el-tree :props="props"
                       :key="item.id"
                       :data="treeData"
                       :default-checked-keys="checkedKeys"
                       node-key="id"
                       ref="tree"
                       show-checkbox
                       highlight-current
                       @check-change="handleCheckChange">
              </el-tree>
            </div>
            <div style="display: flex;justify-content: flex-end;margin-right: 10px">
              <el-button size="mini" @click="cancelUpdateRoleMenu">取消修改</el-button>
              <el-button type="primary" size="mini" @click="updateRoleMenu(index)">确认修改</el-button>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
	</div>
</template>
<script>

	export default {
		mounted() {
			this.loading = true
			this.initRoles()
		},
		data() {
			return {
				loading: false,
				newRole: null,
				newRoleZh: null,
				api: {
					list: '/api/role/list',
					menuTree: '/api/role/menuTree/',
					addRole: '/api/role/addRole',
					deleteRole: '/api/role/delete/',
					updateRole: '/api/role/updateRole'
				},
				roles: [],
				activeColItem: -1,
				checkedKeys: [],
				treeData: [],
				props: {
					label: 'nameZh',
					children: 'children'
				}
			}
		},
		methods: {
			initRoles () {
				this.getRequest(this.api.list).then((resp) => {
					this.loading = false;
					if (resp && resp.status === 200) {
						this.roles = resp.data.records
						this.activeColItem = -1
					}
					
				})
			},
			addNewRole () {
				if(!this.$util.isEmpty(this.newRole) && !this.$util.isEmpty(this.newRoleZh)) {
					this.loading = true
					this.postRequest(this.api.addRole, { role: this.newRole, roleZh: this.newRoleZh }).then((resp) => {
						if(resp && resp.status === 200) {
							let data = resp.data
							this.$message({
								type: data.status,
								message: data.msg
							})
							this.initRoles()
							this.loading = false
							this.newRole = null
							this.newRoleZh = null
						} else {
							this.loading = false
						}
					})
				}
			},
			collapseChange (activeName) {
				if (activeName == '' || activeName == null) return
				this.getRequest(this.api.menuTree + activeName).then((resp) => {
					if (resp && resp.status === 200) {
						let data = resp.data
						this.treeData = data.menus
						this.checkedKeys = data.mids
					}
				})
			},
			deleteRole (id, nameZh) {
				this.$confirm('删除角色[' + nameZh + '], 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.loading = true
					this.deleteRequest(this.api.deleteRole + id).then((resp) => {
						if (resp && resp.status === 200) {
							let data = resp.data
							this.$message({
								type: data.status,
								message: data.msg
							})
							this.initRoles()
							this.loading = false
						} else {
							this.loading = false
						}
					})
				})
			},
			handleCheckChange () {

			},
			cancelUpdateRoleMenu () {
				this.activeColItem = -1
			},
			updateRoleMenu (index) {
				let checkedKeys = this.$refs.tree[index].getCheckedKeys(true)
				this.putRequest(this.api.updateRole, { roleId: this.activeColItem, mids: checkedKeys }).then((resp) => {
					if (resp && resp.status === 200) {
						let data = resp.data
						this.$message({
							type: data.status,
							message: data.msg
						})
						this.activeColItem = -1
					}
				})
			}
		}
	}
</script>