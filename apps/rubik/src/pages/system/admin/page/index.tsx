/**
 * TODO: 添加排序功能
 * BUG: 页面被初始化被渲染了两次。应该是 core 的问题
 */

import { getLink } from '~/core/utils'

import appPageCss from './styled'

export const schema = {
  css: appPageCss,
  type: 'page',
  title: '应用页面管理',
  bodyClassName: 'p-t-none',
  body: {
    type: 'crud',
    name: 'pageList',
    $ref: 'globalCrudCommon',
    api: '$preset.apis.listNav',
    className: 'g-no-border-table',
    saveOrderApi: '$preset.apis.orderNav',
    // filter: '$preset.forms.filterNav',
    draggable: true,
    headerToolbar: [
      {
        type: 'drag-toggler',
        align: 'left',
      },
      {
        $ref: 'globalTableReloadTool',
        target: 'pageList',
      },
      // 表单放在 toolbar 有数据请求时，会异请求多次
      '$preset.forms.filterNav',
      '$preset.actions.addNav',
      '$preset.actions.setHome',
    ],
    footerToolbar: [],
    footable: {
      expand: 'all',
    },
    columns: [
      {
        name: 'label',
        label: '名称',
        remark: '该页面对应菜单的展示名称',
        type: 'tpl',
        tpl: `
          <% if(!!data.icon) { %>
            <i class="<%= data.icon %> cursor-p" data-tooltip="菜单图标" data-position="bottom" ></i>
          <% } else { %>
            <i  style="width:16px;display:inline-block;"></i>
          <% } %>
          <span><%= data.label %></span>
        `,
      },
      {
        name: 'page_type',
        label: '类型',
        type: 'tpl',
        tpl: `
          <% if(data.page_type === '2') {%>
            文件夹
          <% } else { %>
            普通页面
          <%  } %>
          <% if(data.side_visible !== '1') { %>
            <i class="fa fa-eye-slash cursor-p m-l-sm" data-tooltip="侧边栏菜单不可见" data-position="bottom" />
          <% } %>
        `,
      },
      {
        name: 'desc',
        label: '备注信息',
        remark: '对该页面备注信息',
        type: 'input-text',
        // eslint-disable-next-line
        tpl: '${desc|default:-|truncate:10}',
        popOver: {
          body: '$desc',
        },
      },
      // {
      //   name: 'user.username',
      //   label: '创建者',
      //   type: 'input-text',
      // },
      {
        name: 'created_time',
        label: '添加时间',
        type: 'datetime',
        width: 150,
      },
      {
        type: 'operation',
        label: '操作',
        width: 200,
        buttons: [
          '$preset.actions.designPage',
          '$preset.actions.editNav',
          '$preset.actions.editLimit',
          '$preset.actions.delNav',
        ],
      },
    ],
  },
  preset: {
    apis: {},
    actions: {
      setHome: {
        type: 'action',
        align: 'right',
        label: '设置首页',
        icon: 'iconfont icon-duhome pull-left',
        actionType: 'dialog',
        showCloseButton: false,
        dialog: {
          title: '设置应用首页',
          body: {
            api: '$preset.apis.setHome',
            initApi: '$preset.apis.getHome',
            $preset: 'forms.setHome',
          },
        },
      },
      addNav: {
        type: 'action',
        align: 'right',
        label: '添加新页面',
        level: 'primary',
        icon: 'iconfont icon-plus pull-left',
        actionType: 'dialog',
        showCloseButton: false,
        dialog: {
          title: '添加新页面',
          body: {
            api: '$preset.apis.addNav',
            $preset: 'forms.updateNav',
          },
        },
      },
      editNav: {
        type: 'action',
        label: '编辑',
        level: 'link',
        actionType: 'dialog',
        dialog: {
          title: '修改页面信息',
          body: {
            api: '$preset.apis.editNav',
            $preset: 'forms.updateNav',
          },
        },
      },
      designPage: {
        type: 'action',
        label: '设计页面',
        level: 'link',
        hiddenOn: 'data.page_type === "2"',
        actionType: 'link',
        link: getLink('appSystem', 'design/$page_id?label=$label'),
      },
      editLimit: {
        type: 'action',
        label: '页面权限',
        hiddenOn: 'data.page_type === "2"',
        level: 'link',
        actionType: 'dialog',
        dialog: {
          title: '管理页面权限',
          size: 'lg',
          data: {
            id: '$id',
          },
          actions: [],
          bodyClassName: 'p-none',
          body: {
            initApi: '$preset.apis.listLimit',
            $preset: 'forms.editLimit',
          },
        },
      },
      delNav: {
        type: 'action',
        label: '删除',
        className: 'text-danger',
        level: 'link',
        actionType: 'ajax',
        confirmText:
          // eslint-disable-next-line
          '[删除确认] 确认该页面: 【${label|default:-}】，组织页面后将不可恢复，请谨慎操作～',
        api: '$preset.apis.delNav',
      },
    },
    forms: {
      setHome: {
        type: 'form',
        wrapWithPanel: false,
        controls: [
          {
            type: 'tree-select',
            name: 'page_id',
            size: 'full',
            clearable: true,
            multiple: false,
            showIcon: false,
            searchable: true,
            valueField: 'page_id',
            placeholder: '搜索页面',
            label: '应用首页',
            source: '$preset.apis.navParent',
          },
        ],
      },

      updateNav: {
        type: 'form',
        controls: [
          {
            type: 'button-group',
            name: 'page_type',
            label: '页面类型',
            required: true,
            value: '1',
            options: [
              {
                label: '普通页面',
                value: '1',
              },
              {
                label: '文件夹',
                value: '2',
              },
            ],
          },

          {
            name: 'label',
            type: 'input-text',
            label: '菜单名称',
            required: true,
            placeholder: '请输入菜单名称',
            desc: '该页面对应菜单的展示名称',
          },
          {
            type: 'app-icon-selector',
            label: '选择图标',
            placeholder: '请输入图标',
            clearable: true,
            name: 'icon',
          },
          {
            type: 'tree-select',
            name: 'parent_id',
            clearable: true,
            multiple: false,
            valueField: 'id',
            showIcon: false,
            label: '父级页面',
            placeholder: '请选择父级页面',
            value: '0',
            source: {
              url: 'fakeNavParentWithRoot',
              $preset: 'apis.navParent',
            },
          },
          {
            name: 'side_visible',
            label: '是否菜单可见',
            $ref: 'globalSwitch',
            type: 'switch',
            value: '1',
          },
          {
            name: 'desc',
            label: '备注信息',
            placeholder: '请输入备注信息',
            type: 'textarea',
          },
        ],
      },

      editLimit: {
        type: 'form',
        mode: 'normal',
        saveOrderApi: '$preset.apis.orderLimit',
        controls: [
          {
            type: 'table',
            name: 'limitList',
            addable: true,
            editable: true,
            removable: true,
            draggable: true,
            affixHeader: false,
            columnsTogglable: true,
            $preset: 'apis.onOrderChange',
            addApi: '$preset.apis.addLimit',
            updateApi: '$preset.apis.editLimit',
            deleteApi: '$preset.apis.delLimit',
            inputClassName: 'padder g-no-border-table',
            columns: [
              {
                name: 'label',
                label: '权限名称',
                quickEdit: {
                  type: 'input-text',
                  required: true,
                  placeholder: '请输入权限名称',
                },
              },
              {
                name: 'key',
                label: '权限KEY',
                quickEdit: {
                  type: 'input-text',
                  required: true,
                  placeholder: '请输入KEY',
                },
              },
              {
                name: 'needs',
                label: '权限依赖',
                type: 'tpl',
                tpl: '<%= data.needs && data.needs.map((i) => i.label).join(",") %>',
                quickEdit: {
                  type: 'select',
                  placeholder: '请选择依赖权限',
                  multiple: true,
                  clearable: true,
                  joinValues: false,
                  source: '$preset.apis.needsOptions',
                },
              },
              {
                name: 'desc',
                label: '权限描述',
                quickEdit: {
                  type: 'input-text',
                  placeholder: '请输入权限描述',
                },
              },
            ],
          },
        ],
      },

      filterNav: {
        type: 'form',
        wrapWithPanel: false,
        target: 'pageList',
        mode: 'inline',
        // className: 'filter-form',
        controls: [
          {
            name: 'n_label',
            type: 'input-text',
            placeholder: '请输入页面名称',
            clearable: true,
            addOn: {
              iconOnly: true,
              icon: 'iconfont icon-ai-search',
              type: 'submit',
            },
          },
          // {
          //   type: 'action',
          //   icon: 'fa fa-search',
          //   iconOnly: true,
          // },
          // {
          // TODO: 解决报错
          // type: 'tree-select',
          // name: 'n_page_id',
          // size: 'full',
          // clearable: true,
          // multiple: false,
          // showIcon: false,
          // searchable: true,
          // submitOnChange: true,
          // valueField: 'id',
          // value: '',
          // placeholder: '搜索页面',
          // source: '$preset.apis.navParent',
          // },
        ],
      },
    },
  },
}
