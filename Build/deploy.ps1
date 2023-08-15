tsc -p ../Set.Api/Scripts
Remove-Item publish -Recurse -ErrorAction Ignore
dotnet publish ../Set.Api/Set.Api.csproj /p:IsTransformWebConfigDisabled=true -c Release -o .\publish -r linux-x64 --self-contained false
tar -czvf publish.tar.gz publish
scp publish.tar.gz deployserver.sh kestrel-playset.service alliwong@192.155.81.29:/home/alliwong/
ssh alliwong@192.155.81.29 'bash ./deployserver.sh'
Remove-Item publish.tar.gz