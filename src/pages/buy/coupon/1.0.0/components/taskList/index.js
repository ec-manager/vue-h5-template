// 任务列表颜色设置
const G_TASK_SKIN = {
    // 紫色
    0: {
        normal: '#7953FC',
        bgBackground: 'linear-gradient(180deg, #E4E7FF 0%, #E8F0FF 100%)',
        btnBackground: 'linear-gradient(180deg, #7953FC 0%, rgba(121, 83, 252, 0.7) 100%)'
    },
    // 蓝色
    1: {
        normal: '#0091FF',
        bgBackground: 'linear-gradient(180deg, #D7F2FF 0%, #DFFCFF 100%)',
        btnBackground: 'linear-gradient(180deg, #0091FF 0%, rgba(0, 145, 255, 0.7) 100%)'
    },
    // 绿色
    2: {
        normal: '#01BC92',
        bgBackground: 'linear-gradient(180deg, #D1FED3 0%, #E0FFDF 100%)',
        btnBackground: 'linear-gradient(180deg, #01BC92 0%, #1CCEA6 100%)'
    },
    // 橙色
    3: {
        normal: '#F87C00',
        bgBackground: 'linear-gradient(180deg, #FFECDA 0%, #FFF4DF 100%)',
        btnBackground: 'linear-gradient(180deg, #F79407 0%, #FCAE3D 100%)'
    },
    // 红色
    4: {
        normal: '#FF5346',
        bgBackground: 'linear-gradient(180deg, #FFDEE1 0%, #FFE3DF 100%)',
        btnBackground: 'linear-gradient(180deg, #FF5346 0%, #FC6C3D 100%)'
    }
};

const TASK_STATE = {
    notStarted: 1, // 未开始
    finished: 2, // 已完成
    hasReturned: 3 // 已返现
};

const BTN_TEXT = {
    '2': '已完成',
    '3': '已返现'
}
export default {
    name: 'taskList',
    props: {
       title: String,
       list: {
           type: Array,
           required: true
       }
    },
    data () {
        return {
            taskSkin: G_TASK_SKIN,
            taskState: TASK_STATE, // 任务状态
            btnText: BTN_TEXT
        };
    },
    computed: {
        // 任务列表颜色设置个数
        taskSkinLen() {
            return Object.keys(G_TASK_SKIN).length;
        }
    },
    methods: {
        // 生成任务
        addUserTask(task, index) {
            this.$emit('addUserTask', task, index);
        }
    }
};