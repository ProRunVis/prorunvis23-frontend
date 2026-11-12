import com.github.gradle.node.npm.task.NpmTask


plugins{
    id("com.github.node-gradle.node") version "3.0.1"
}

apply(plugin = "base")

node{
    version = "20.11.0"
    download = true
}

tasks.register<NpmTask>("appNpmInstall"){
    workingDir.set(file("${project.projectDir}"))
    args.set(listOf("install", "react-folder-tree@5.1.1", "--force"))
}
tasks.register<NpmTask>("appNpmBuild") {
    workingDir.set(file("${project.projectDir}"))
    args.set(listOf("run", "build"))
}


tasks.named("appNpmBuild"){
    dependsOn(tasks["appNpmInstall"])
}

tasks.named("build"){
    dependsOn(tasks["appNpmBuild"])
}
